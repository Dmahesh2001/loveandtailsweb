/*
 * API services, organised by feature: services/<feature>/<feature>.service.js.
 * Shared HTTP + token plumbing lives in services/core.
 * To add a feature, create its folder and register it here so callers can use
 * `api.<method>()` or import the service directly.
 */
import * as auth from './auth/auth.service';
import * as user from './user/user.service';
import * as waitlist from './waitlist/waitlist.service';

export { API_URL, ApiError } from './core/client';
export { getTokens, setTokens, onTokensChange } from './core/tokens';

export const api = { ...auth, ...user, ...waitlist };
