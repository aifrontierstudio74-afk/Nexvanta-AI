import { inngest } from '@/lib/inngest/client';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail, getEmailTemplate } from '@/lib/email';

/**
 * 1. Hourly check to expire manual subscriptions and pause grace-expired subscriptions.
 */
export const expireCheckFunction = inngest.createFunction(
  { id: 'billing-expire-check', triggers: [{ cron: '0 * * * *' }] },
  async ({ step }) => {
    await step.run('check-expired-and-grace-periods', async () => {
      const admin = createAdminClient();
      if (!admin) return { checked: 0 };

      const now = new Date().toISOString();

      // Expire manual subscriptions whose period end has passed
      const { data: expiredSubs } = await admin
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('provider', 'manual')
        .eq('status', 'active')
        .lt('current_period_end', now)
        .select('id, user_id, automation_slug');

      // Pause past_due subscriptions past grace_until
      const { data: pausedSubs } = await admin
        .from('subscriptions')
        .update({ status: 'paused' })
        .eq('status', 'past_due')
        .lt('grace_until', now)
        .select('id, user_id, automation_slug');

      // Pause instances associated with expired or paused subscriptions
      const affected = [...(expiredSubs || []), ...(pausedSubs || [])];
      for (const sub of affected) {
        await admin
          .from('automation_instances')
          .update({ status: 'paused' })
          .eq('user_id', sub.user_id)
          .eq('automation_slug', sub.automation_slug)
          .eq('status', 'active');
      }

      return { expiredCount: expiredSubs?.length || 0, pausedCount: pausedSubs?.length || 0 };
    });
  }
);

/**
 * 2. Daily renewal reminders (3-days prior and day of expiry).
 */
export const renewalRemindersFunction = inngest.createFunction(
  { id: 'billing-renewal-reminders', triggers: [{ cron: '0 9 * * *' }] },
  async ({ step }) => {
    await step.run('send-renewal-reminders', async () => {
      const admin = createAdminClient();
      if (!admin) return { sent: 0 };

      const now = new Date();
      const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
      const inFourDays = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString();

      // Fetch subscriptions expiring in 3 days
      const { data: upcomingSubs } = await admin
        .from('subscriptions')
        .select(`
          id,
          user_id,
          automation_slug,
          current_period_end,
          plans ( name, price_inr ),
          profiles:user_id ( full_name, phone )
        `)
        .eq('status', 'active')
        .gte('current_period_end', inThreeDays)
        .lte('current_period_end', inFourDays);

      if (upcomingSubs && upcomingSubs.length > 0) {
        for (const sub of upcomingSubs) {
          const plan = Array.isArray(sub.plans) ? sub.plans[0] : sub.plans;
          const { data: authUser } = await admin.auth.admin.getUserById(sub.user_id);
          if (authUser?.user?.email) {
            const template = getEmailTemplate('renewal_reminder', {
              planName: plan?.name || sub.automation_slug,
              amount: plan?.price_inr || 0,
              date: new Date(sub.current_period_end).toLocaleDateString('en-IN'),
            });
            await sendEmail({
              to: authUser.user.email,
              subject: template.subject,
              html: template.html,
            });
          }
        }
      }

      return { processed: upcomingSubs?.length || 0 };
    });
  }
);

/**
 * 3. Daily cleanup for stale subscriptions left in 'created' status over 24 hours.
 */
export const cleanupStaleCreatedFunction = inngest.createFunction(
  { id: 'billing-cleanup-stale-created', triggers: [{ cron: '0 3 * * *' }] },
  async ({ step }) => {
    await step.run('cleanup-stale-created-subs', async () => {
      const admin = createAdminClient();
      if (!admin) return { cancelled: 0 };

      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const { data } = await admin
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('status', 'created')
        .lt('created_at', yesterday)
        .select('id');

      return { cancelledCount: data?.length || 0 };
    });
  }
);

/**
 * 4. Alert triggered when an automation instance experiences repeated failures.
 */
export const failureAlertFunction = inngest.createFunction(
  { id: 'runs-failure-alert', triggers: [{ event: 'nexvanta/run.failed' }] },
  async ({ event, step }: any) => {
    await step.run('evaluate-failure-streak', async () => {
      const { instanceId, userId, slug, error } = event.data;
      if (!instanceId) return;

      const admin = createAdminClient();
      if (!admin) return;

      // Count last 3 runs
      const { data: recentRuns } = await admin
        .from('runs')
        .select('status')
        .eq('instance_id', instanceId)
        .order('created_at', { ascending: false })
        .limit(3);

      const allFailed =
        recentRuns &&
        recentRuns.length >= 3 &&
        recentRuns.every((r) => r.status === 'failed');

      if (allFailed) {
        // Mark instance error & notify user
        await admin
          .from('automation_instances')
          .update({ status: 'error', last_error: error || 'Repeated execution failure' })
          .eq('id', instanceId);

        await admin.from('notifications').insert({
          user_id: userId,
          title: `Automation Paused: Consecutive failures`,
          body: `Instance ${instanceId} encountered 3 consecutive errors and was paused to protect your quota.`,
        });

        const { data: user } = await admin.auth.admin.getUserById(userId);
        if (user?.user?.email) {
          const tpl = getEmailTemplate('failure_alert', {
            instanceName: `Automation ${slug}`,
            slug,
            lastError: error || 'Execution failure streak',
          });
          await sendEmail({
            to: user.user.email,
            subject: tpl.subject,
            html: tpl.html,
          });
        }
      }
    });
  }
);

/**
 * 5. 80% Quota Warning Event Handler
 */
export const usageWarn80Function = inngest.createFunction(
  { id: 'usage-warn-80', triggers: [{ event: 'nexvanta/usage.warn_80' }] },
  async ({ event, step }: any) => {
    await step.run('send-80-percent-warning', async () => {
      const { userId, slug, metric, used, limit } = event.data;
      const admin = createAdminClient();
      if (!admin) return;

      // Create in-app notification
      await admin.from('notifications').insert({
        user_id: userId,
        title: `80% Limit Warning (${metric})`,
        body: `You have consumed ${used} of ${limit} ${metric} for ${slug}. Consider upgrading your plan to avoid interruption.`,
      });

      const { data: user } = await admin.auth.admin.getUserById(userId);
      if (user?.user?.email) {
        const tpl = getEmailTemplate('usage_80', {
          metric,
          automationTitle: slug,
          used,
          limit,
        });
        await sendEmail({
          to: user.user.email,
          subject: tpl.subject,
          html: tpl.html,
        });
      }
    });
  }
);

export const allInngestFunctions = [
  expireCheckFunction,
  renewalRemindersFunction,
  cleanupStaleCreatedFunction,
  failureAlertFunction,
  usageWarn80Function,
];
