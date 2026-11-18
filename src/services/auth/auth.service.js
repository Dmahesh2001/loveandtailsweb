import { send } from '../core/client';
import { getTokens, setTokens } from '../core/tokens';

export async function login(email, password) {
  const { data } = await send('/auth/token/', { method: 'POST', body: { email, password } });
  setTokens({ access: data.access, refresh: data.refresh });
  return data;
}

export function register({ email, password, first_name = '', last_name = '', phone_number = '' }) {
  return send('/auth/register/', {
    method: 'POST',
    body: { email, password, first_name, last_name, phone_number },
  }).then((r) => r.data);
}

export async function logout() {
  const refresh = getTokens()?.refresh;
  setTokens(null);
  if (!refresh) return;
  try {
    await send('/auth/logout/', { method: 'POST', body: { refresh } });
  } catch {
    /* already expired or offline — the local session is gone either way */
  }
}
