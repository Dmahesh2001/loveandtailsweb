import { send } from '../core/client';

/** Returns { created, email, detail }. */
export async function joinWaitlist(email) {
  const { status, data } = await send('/waitlist/', { method: 'POST', body: { email } });
  return { created: status === 201, ...data };
}
