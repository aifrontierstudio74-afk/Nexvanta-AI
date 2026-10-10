import Razorpay from 'razorpay';
import { createAdminClient } from '../lib/supabase/admin';
import { env } from '../lib/env';

/**
 * Script: Create Razorpay Subscription Plans
 * Idempotently checks active plans in database and creates corresponding Razorpay plans.
 * Run with: npx ts-node scripts/create-razorpay-plans.ts
 */
async function main() {
  console.log('--- NEXVANTA.AI: Syncing Razorpay Plans ---');

  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    console.error('❌ RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing in environment.');
    process.exit(1);
  }

  const razorpay = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });

  const admin = createAdminClient();
  if (!admin) {
    console.error('❌ Supabase admin client could not be initialized.');
    process.exit(1);
  }

  // Fetch plans without razorpay_plan_id
  const { data: plans, error } = await admin
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .is('razorpay_plan_id', null);

  if (error) {
    console.error('Failed to fetch plans from Supabase:', error.message);
    process.exit(1);
  }

  if (!plans || plans.length === 0) {
    console.log('✓ All active plans already have Razorpay plan IDs assigned.');
    return;
  }

  console.log(`Found ${plans.length} plan(s) to create on Razorpay...`);

  for (const plan of plans) {
    let priceInRupees = plan.price_inr;
    if (!env.PRICES_INCLUDE_GST) {
      priceInRupees = Math.round(priceInRupees * (1 + env.GST_PERCENT / 100));
    }
    const amountInPaise = priceInRupees * 100;

    try {
      console.log(`Creating Razorpay plan: ${plan.name} (${plan.code}) - ₹${priceInRupees}/mo...`);
      const rzpPlan = await razorpay.plans.create({
        period: 'monthly',
        interval: 1,
        item: {
          name: `Nexvanta.AI ${plan.name} Plan (${plan.automation_slug})`,
          amount: amountInPaise,
          currency: 'INR',
          description: `Monthly subscription to ${plan.name} tier for ${plan.automation_slug}`,
        },
        notes: {
          code: plan.code,
          automation_slug: plan.automation_slug,
        },
      });

      console.log(`✓ Created Razorpay Plan ID: ${rzpPlan.id}`);

      // Update plan in DB
      await admin
        .from('plans')
        .update({ razorpay_plan_id: rzpPlan.id })
        .eq('id', plan.id);
    } catch (createErr) {
      console.error(`Failed to create plan ${plan.code}:`, createErr);
    }
  }

  console.log('✓ Plan synchronization complete.');
}

if (require.main === module) {
  main().catch(console.error);
}

export { main as createRazorpayPlans };
