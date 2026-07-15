import { supabasePublic } from '$lib/server/supabase.js';

export async function load() {
	const [{ data: profile }, { data: projects }, { data: experience }] = await Promise.all([
		supabasePublic.from('profile').select('*').eq('id', 1).single(),
		supabasePublic
			.from('projects')
			.select('*')
			.order('sort_order', { ascending: true })
			.order('created_at', { ascending: false }),
		supabasePublic
			.from('experience')
			.select('*')
			.order('sort_order', { ascending: true })
			.order('start_date', { ascending: false })
	]);

	return {
		profile: profile ?? {},
		projects: projects ?? [],
		experience: experience ?? []
	};
}
