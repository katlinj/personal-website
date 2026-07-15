import { env } from '$env/dynamic/private';
import crypto from 'node:crypto';

export const COOKIE_NAME = 'admin_session';

function sign(value) {
	const secret = env.SESSION_SECRET || 'dev-only-insecure-secret';
	return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

/** Creates a signed session token to store in a cookie after a correct login. */
export function createSessionToken() {
	const payload = 'admin';
	return `${payload}.${sign(payload)}`;
}

/** Verifies a session token pulled from the request cookie. */
export function verifySessionToken(token) {
	if (!token) return false;
	const [payload, sig] = token.split('.');
	if (!payload || !sig) return false;
	const expected = sign(payload);
	try {
		return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
	} catch {
		return false;
	}
}

/** Checks a submitted password against the ADMIN_PASSWORD environment variable. */
export function checkPassword(password) {
	return Boolean(env.ADMIN_PASSWORD) && password === env.ADMIN_PASSWORD;
}
