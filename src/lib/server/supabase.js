import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

// Used for public, read-only queries (respects Row Level Security policies).
export const supabasePublic = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
	auth: { persistSession: false }
});

// Used only from admin form actions, after the session cookie has been verified.
// The service role key bypasses Row Level Security, so it must never be sent to the browser.
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
	auth: { autoRefreshToken: false, persistSession: false }
});
