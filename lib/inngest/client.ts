import { Inngest } from 'inngest';
import { env } from '@/lib/env';

export const inngest = new Inngest({
  id: 'nexvanta-ai',
  eventKey: env.INNGEST_EVENT_KEY || undefined,
});
