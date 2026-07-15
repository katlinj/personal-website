import { redirect, fail } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase.js';
import { COOKIE_NAME, createSessionToken, verifySessionToken, checkPassword } from '$lib/server/auth.js';
import { randomUUID } from 'crypto';

function isAuthed(cookies) {
	return verifySessionToken(cookies.get(COOKIE_NAME));
}

export async function load({ cookies }) {
	if (!isAuthed(cookies)) {
		return { authenticated: false };
	}

	const [{ data: profile }, { data: projects }, { data: experience }] = await Promise.all([
		supabaseAdmin.from('profile').select('*').eq('id', 1).single(),
		supabaseAdmin.from('projects').select('*').order('sort_order', { ascending: true }),
		supabaseAdmin.from('experience').select('*').order('sort_order', { ascending: true })
	]);

	return {
		authenticated: true,
		profile: profile ?? {},
		projects: projects ?? [],
		experience: experience ?? []
	};
}

export const actions = {
	login: async ({ request, cookies }) => {
		const form = await request.formData();
		const password = form.get('password')?.toString() ?? '';

		if (!checkPassword(password)) {
			return fail(401, { error: 'Wrong password.' });
		}

		cookies.set(COOKIE_NAME, createSessionToken(), {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: true,
			maxAge: 60 * 60 * 24 * 30
		});

		return { success: true };
	},

	logout: async ({ cookies }) => {
		cookies.delete(COOKIE_NAME, { path: '/' });
		throw redirect(303, '/admin');
	},

	saveProfile: async ({ request, cookies }) => {
		if (!isAuthed(cookies)) return fail(401, { error: 'Not logged in.' });
		const form = await request.formData();
		const skills = (form.get('skills')?.toString() ?? '')
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);

		const { error } = await supabaseAdmin
			.from('profile')
			.update({
				name: form.get('name')?.toString() ?? '',
				role: form.get('role')?.toString() ?? '',
				bio: form.get('bio')?.toString() ?? '',
				location: form.get('location')?.toString() ?? '',
				email: form.get('email')?.toString() ?? '',
				github_url: form.get('github_url')?.toString() ?? '',
				linkedin_url: form.get('linkedin_url')?.toString() ?? '',
				resume_url: form.get('resume_url')?.toString() ?? '',
				skills,
				updated_at: new Date().toISOString()
			})
			.eq('id', 1);

		if (error) return fail(500, { error: error.message });
		return { success: true, saved: 'profile' };
	},

	saveProject: async ({ request, cookies }) => {
		if (!isAuthed(cookies)) {
			return fail(401, { error: 'Not logged in.' });
		}

		const form = await request.formData();

		const id = form.get('id')?.toString();

		const image = form.get('image');
		const removeImage = form.get('remove_image') === 'true';
		const existingImage = form.get('existing_image')?.toString() || null;

		const techStack = (form.get('tech_stack')?.toString() ?? '')
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);

		let imageUrl = existingImage;

		// Remove existing image
		if (removeImage && existingImage) {
			try {
				const fileName = existingImage.split('/').pop();

				await supabaseAdmin.storage
					.from('project-images')
					.remove([`projects/${fileName}`]);

				imageUrl = null;
			} catch (err) {
				console.error('Failed to delete image:', err);
			}
		}

		// Upload new image
		if (image instanceof File && image.size > 0) {
			// Delete old image first
			if (existingImage) {
				try {
					const oldFile = existingImage.split('/').pop();

					await supabaseAdmin.storage
						.from('project-images')
						.remove([`projects/${oldFile}`]);
				} catch (err) {
					console.error('Failed to delete old image:', err);
				}
			}

			const extension = image.name.split('.').pop();
			const fileName = `${randomUUID()}.${extension}`;
			const filePath = `projects/${fileName}`;

			const { error: uploadError } = await supabaseAdmin.storage
				.from('project-images')
				.upload(filePath, image, {
					contentType: image.type,
					upsert: false
				});

			if (uploadError) {
				return fail(500, { error: uploadError.message });
			}

			const {
				data: { publicUrl }
			} = supabaseAdmin.storage
				.from('project-images')
				.getPublicUrl(filePath);

			imageUrl = publicUrl;
		}

		const payload = {
			title: form.get('title')?.toString() ?? '',
			description: form.get('description')?.toString() ?? '',
			tech_stack: techStack,
			project_url: form.get('project_url')?.toString() ?? '',
			github_url: form.get('github_url')?.toString() ?? '',
			featured: form.get('featured') === 'on',
			sort_order: Number(form.get('sort_order')) || 0,
			details: form.get('details')?.toString() ?? '',
			image_url: imageUrl
		};

		const { error } = id
			? await supabaseAdmin.from('projects').update(payload).eq('id', id)
			: await supabaseAdmin.from('projects').insert(payload);

		if (error) {
			return fail(500, { error: error.message });
		}

		return {
			success: true,
			saved: 'project'
		};
	},

	deleteProject: async ({ request, cookies }) => {
		if (!isAuthed(cookies)) return fail(401, { error: 'Not logged in.' });
		const form = await request.formData();
		const id = form.get('id')?.toString();
		const { error } = await supabaseAdmin.from('projects').delete().eq('id', id);
		if (error) return fail(500, { error: error.message });
		return { success: true, deleted: 'project' };
	},

	saveExperience: async ({ request, cookies }) => {
		if (!isAuthed(cookies)) return fail(401, { error: 'Not logged in.' });
		const form = await request.formData();
		const id = form.get('id')?.toString();
		const techStack = (form.get('tech_stack')?.toString() ?? '')
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);

		const payload = {
			company: form.get('company')?.toString() ?? '',
			role: form.get('role')?.toString() ?? '',
			start_date: form.get('start_date')?.toString() || null,
			end_date: form.get('end_date')?.toString() || null,
			is_current: form.get('is_current') === 'on',
			description: form.get('description')?.toString() ?? '',
			tech_stack: techStack,
			sort_order: Number(form.get('sort_order')) || 0
		};

		const { error } = id
			? await supabaseAdmin.from('experience').update(payload).eq('id', id)
			: await supabaseAdmin.from('experience').insert(payload);

		if (error) return fail(500, { error: error.message });
		return { success: true, saved: 'experience' };
	},

	deleteExperience: async ({ request, cookies }) => {
		if (!isAuthed(cookies)) return fail(401, { error: 'Not logged in.' });
		const form = await request.formData();
		const id = form.get('id')?.toString();
		const { error } = await supabaseAdmin.from('experience').delete().eq('id', id);
		if (error) return fail(500, { error: error.message });
		return { success: true, deleted: 'experience' };
	}
};
