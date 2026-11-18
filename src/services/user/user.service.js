import { authed } from '../core/client';

export function getMe() {
  return authed('/users/me/');
}

export function updateMe(fields) {
  return authed('/users/me/', { method: 'PATCH', body: fields });
}
