<script>
	import { enhance } from '$app/forms';

	export let data;
	export let form;

	$: authenticated = data.authenticated;
	$: profile = data.profile ?? {};
	$: projects = data.projects ?? [];
	$: experience = data.experience ?? [];

	let editingProjectId = null;
	let editingExperienceId = null;
	let showNewProject = false;
	let showNewExperience = false;

	function closeProjectForm() {
		return async ({ update }) => {
			editingProjectId = null;
			showNewProject = false;
			await update();
		};
	}

	function closeExperienceForm() {
		return async ({ update }) => {
			editingExperienceId = null;
			showNewExperience = false;
			await update();
		};
	}
</script>

<svelte:head>
	<title>Admin — {profile.name || 'Portfolio'}</title>
</svelte:head>

{#if !authenticated}
	<div class="login-wrap">
		<div class="login-container">
			<div class="login-decoration">✦</div>
			<form method="POST" action="?/login" use:enhance class="panel login-panel">
				<h1>Admin Access</h1>
				<p class="hint">Enter your password to edit this site.</p>
				<div class="input-group">
					<input
						type="password"
						name="password"
						placeholder="Password"
						autocomplete="current-password"
						required
					/>
				</div>
				<button type="submit" class="btn-primary btn-full">Log in</button>
				{#if form?.error}<p class="error">{form.error}</p>{/if}
			</form>
		</div>
	</div>
{:else}
	<div class="dashboard">
		<header class="dashboard-header">
			<div class="header-left">
				<span class="sparkle">✦</span>
				<h1>Admin</h1>
				<a href="/" class="view-link">← View site</a>
			</div>
			<form method="POST" action="?/logout">
				<button type="submit" class="btn-outline btn-small">Log out</button>
			</form>
		</header>

		<!-- Messages -->
		{#if form?.error}
			<div class="form-message error">{form.error}</div>
		{/if}
		{#if form?.saved === 'project'}
			<div class="form-message success">✓ Project saved successfully!</div>
		{/if}
		{#if form?.deleted === 'project'}
			<div class="form-message success">✓ Project deleted successfully!</div>
		{/if}
		{#if form?.saved === 'experience'}
			<div class="form-message success">✓ Experience saved successfully!</div>
		{/if}
		{#if form?.deleted === 'experience'}
			<div class="form-message success">✓ Experience deleted successfully!</div>
		{/if}
		{#if form?.saved === 'profile'}
			<div class="form-message success">✓ Profile saved successfully!</div>
		{/if}

		<!-- Profile Section -->
		<section class="panel">
			<div class="panel-header">
				<h2 class="section-title">Profile</h2>
				<span class="section-badge">⚡</span>
			</div>
			<form method="POST" action="?/saveProfile" use:enhance class="grid-form">
				<label>
					<span class="label-text">Name</span>
					<input name="name" value={profile.name ?? ''} placeholder="Your name" />
				</label>
				<label>
					<span class="label-text">Role</span>
					<input name="role" value={profile.role ?? ''} placeholder="Software Engineer" />
				</label>
				<label>
					<span class="label-text">Location</span>
					<input name="location" value={profile.location ?? ''} placeholder="City, Country" />
				</label>
				<label>
					<span class="label-text">Email</span>
					<input name="email" value={profile.email ?? ''} placeholder="you@email.com" type="email" />
				</label>
				<label>
					<span class="label-text">GitHub URL</span>
					<input name="github_url" value={profile.github_url ?? ''} placeholder="https://github.com/username" />
				</label>
				<label>
					<span class="label-text">LinkedIn URL</span>
					<input name="linkedin_url" value={profile.linkedin_url ?? ''} placeholder="https://linkedin.com/in/username" />
				</label>
				<label>
					<span class="label-text">Resume URL</span>
					<input name="resume_url" value={profile.resume_url ?? ''} placeholder="https://example.com/resume.pdf" />
				</label>
				<label class="full">
					<span class="label-text">Bio</span>
					<textarea name="bio" rows="4" placeholder="Tell people about yourself...">{profile.bio ?? ''}</textarea>
				</label>
				<label class="full">
					<span class="label-text">Skills (comma separated)</span>
					<input
						name="skills"
						value={(profile.skills ?? []).join(', ')}
						placeholder="Java, TypeScript, Python"
					/>
				</label>
				<div class="row-actions">
					<button type="submit" class="btn-primary">Save Profile</button>
				</div>
			</form>
		</section>

		<!-- Projects Section -->
		<section class="panel">
			<div class="panel-header">
				<h2 class="section-title">Projects</h2>
				<span class="section-badge">📦</span>
			</div>
			<ul class="manage-list">
				{#each projects as p (p.id)}
					<li>
						{#if editingProjectId === p.id}
							<form
								method="POST"
								action="?/saveProject"
								use:enhance={closeProjectForm}
								class="grid-form edit-form"
								enctype="multipart/form-data"
							>
								<input type="hidden" name="id" value={p.id} />
								<label>
									<span class="label-text">Title</span>
									<input name="title" value={p.title} required />
								</label>
								<label>
									<span class="label-text">Order</span>
									<input name="sort_order" type="number" value={p.sort_order ?? 0} />
								</label>
								<label class="full">
									<span class="label-text">Description</span>
									<textarea name="description" rows="3">{p.description || ''}</textarea>
								</label>
								<label class="full">
									<span class="label-text">Tech Stack (comma separated)</span>
									<input
										name="tech_stack"
										value={(p.tech_stack ?? []).join(', ')}
										placeholder="SvelteKit, TypeScript, Firebase"
									/>
								</label>
								<label>
									<span class="label-text">Live URL</span>
									<input name="project_url" value={p.project_url ?? ''} placeholder="https://example.com" />
								</label>
								<label>
									<span class="label-text">Source URL</span>
									<input name="github_url" value={p.github_url ?? ''} placeholder="https://github.com/username/repo" />
								</label>
								
								<!-- Image Upload -->
								<label class="full">
									<span class="label-text">Project Image</span>
									{#if p.image_url}
										<div class="image-preview">
											<img src={p.image_url} alt={p.title} />
											<div class="image-actions">
												<label class="change-image-btn">
													Change Image
													<input type="file" name="image" accept="image/*" />
												</label>
												<button type="button" class="remove-image-btn" on:click={() => {
													const removeInput = document.querySelector('input[name="remove_image"]');
													if (removeInput) removeInput.value = 'true';
													const preview = document.querySelector('.image-preview');
													if (preview) preview.style.display = 'none';
												}}>
													✕ Remove
												</button>
											</div>
										</div>
									{:else}
										<div class="image-upload-area">
											<input type="file" name="image" accept="image/*" />
											<small class="hint">Upload a project screenshot (JPEG, PNG, WebP)</small>
										</div>
									{/if}
									<input type="hidden" name="existing_image" value={p.image_url || ''} />
									<input type="hidden" name="remove_image" value="false" />
								</label>
								
								<label class="full">
									<span class="label-text">Additional Details</span>
									<textarea name="details" rows="4" placeholder="Project details, challenges, learnings...">{p.details || ''}</textarea>
								</label>
								
								<label class="checkbox">
									<input type="checkbox" name="featured" checked={p.featured} />
									<span class="label-text">Featured</span>
								</label>
								
								<div class="row-actions">
									<button type="submit" class="btn-primary">Save Project</button>
									<button type="button" class="btn-ghost" on:click={() => (editingProjectId = null)}>Cancel</button>
								</div>
							</form>
						{:else}
							<div class="row">
								<span class="row-title">
									<span class="project-icon">📄</span>
									{p.title}
									{#if p.featured}
										<span class="featured-badge">⭐</span>
									{/if}
									{#if p.image_url}
										<span class="image-indicator">🖼️</span>
									{/if}
								</span>
								<div class="row-actions">
									<button type="button" class="btn-ghost btn-small" on:click={() => (editingProjectId = p.id)}>Edit</button>
									<form method="POST" action="?/deleteProject" use:enhance>
										<input type="hidden" name="id" value={p.id} />
										<button type="submit" class="btn-danger btn-small" on:click={() => {
											if (!confirm(`Delete project "${p.title}"?`)) {
												event.preventDefault();
											}
										}}>Delete</button>
									</form>
								</div>
							</div>
						{/if}
					</li>
				{/each}
			</ul>

			{#if showNewProject}
				<form
					method="POST"
					action="?/saveProject"
					use:enhance={closeProjectForm}
					class="grid-form new-form"
					enctype="multipart/form-data"
				>
					<label>
						<span class="label-text">Title</span>
						<input name="title" required placeholder="Project name" />
					</label>
					<label>
						<span class="label-text">Order</span>
						<input name="sort_order" type="number" value="0" />
					</label>
					<label class="full">
						<span class="label-text">Description</span>
						<textarea name="description" rows="3" placeholder="What does this project do?"></textarea>
					</label>
					<label class="full">
						<span class="label-text">Tech Stack (comma separated)</span>
						<input name="tech_stack" placeholder="SvelteKit, TypeScript, Firebase" />
					</label>
					<label>
						<span class="label-text">Live URL</span>
						<input name="project_url" placeholder="https://example.com" />
					</label>
					<label>
						<span class="label-text">Source URL</span>
						<input name="github_url" placeholder="https://github.com/username/repo" />
					</label>
					
					<label class="full">
						<span class="label-text">Project Image</span>
						<div class="image-upload-area">
							<input type="file" name="image" accept="image/*" />
							<small class="hint">Upload a project screenshot (JPEG, PNG, WebP)</small>
						</div>
						<input type="hidden" name="existing_image" value="" />
						<input type="hidden" name="remove_image" value="false" />
					</label>
					
					<label class="full">
						<span class="label-text">Additional Details</span>
						<textarea name="details" rows="4" placeholder="Project details, challenges, learnings..."></textarea>
					</label>
					
					<label class="checkbox">
						<input type="checkbox" name="featured" />
						<span class="label-text">Featured</span>
					</label>
					
					<div class="row-actions">
						<button type="submit" class="btn-primary">Add Project</button>
						<button type="button" class="btn-ghost" on:click={() => (showNewProject = false)}>Cancel</button>
					</div>
				</form>
			{:else}
				<button type="button" class="add-btn" on:click={() => (showNewProject = true)}>
					<span class="add-icon">+</span> Add Project
				</button>
			{/if}
		</section>

		<!-- Experience Section -->
		<section class="panel">
			<div class="panel-header">
				<h2 class="section-title">Experience</h2>
				<span class="section-badge">💼</span>
			</div>
			<ul class="manage-list">
				{#each experience as e (e.id)}
					<li>
						{#if editingExperienceId === e.id}
							<form
								method="POST"
								action="?/saveExperience"
								use:enhance={closeExperienceForm}
								class="grid-form edit-form"
							>
								<input type="hidden" name="id" value={e.id} />
								<label>
									<span class="label-text">Company</span>
									<input name="company" value={e.company} required />
								</label>
								<label>
									<span class="label-text">Role</span>
									<input name="role" value={e.role} required />
								</label>
								<label>
									<span class="label-text">Start Date</span>
									<input name="start_date" type="date" value={e.start_date ?? ''} />
								</label>
								<label>
									<span class="label-text">End Date</span>
									<input name="end_date" type="date" value={e.end_date ?? ''} />
								</label>
								<label class="checkbox">
									<input type="checkbox" name="is_current" checked={e.is_current} />
									<span class="label-text">Current Role</span>
								</label>
								<label>
									<span class="label-text">Order</span>
									<input name="sort_order" type="number" value={e.sort_order ?? 0} />
								</label>
								<label class="full">
									<span class="label-text">Description</span>
									<textarea name="description" rows="3">{e.description || ''}</textarea>
								</label>
								<label class="full">
									<span class="label-text">Tech Stack (comma separated)</span>
									<input
										name="tech_stack"
										value={(e.tech_stack ?? []).join(', ')}
										placeholder="Java, TypeScript, Python"
									/>
								</label>
								<div class="row-actions">
									<button type="submit" class="btn-primary">Save Experience</button>
									<button type="button" class="btn-ghost" on:click={() => (editingExperienceId = null)}>Cancel</button>
								</div>
							</form>
						{:else}
							<div class="row">
								<span class="row-title">
									<span class="project-icon">💼</span>
									{e.role} @ {e.company}
								</span>
								<div class="row-actions">
									<button type="button" class="btn-ghost btn-small" on:click={() => (editingExperienceId = e.id)}>Edit</button>
									<form method="POST" action="?/deleteExperience" use:enhance>
										<input type="hidden" name="id" value={e.id} />
										<button type="submit" class="btn-danger btn-small" on:click={() => {
											if (!confirm(`Delete experience at "${e.company}"?`)) {
												event.preventDefault();
											}
										}}>Delete</button>
									</form>
								</div>
							</div>
						{/if}
					</li>
				{/each}
			</ul>

			{#if showNewExperience}
				<form
					method="POST"
					action="?/saveExperience"
					use:enhance={closeExperienceForm}
					class="grid-form new-form"
				>
					<label>
						<span class="label-text">Company</span>
						<input name="company" required placeholder="Company name" />
					</label>
					<label>
						<span class="label-text">Role</span>
						<input name="role" required placeholder="Your role" />
					</label>
					<label>
						<span class="label-text">Start Date</span>
						<input name="start_date" type="date" />
					</label>
					<label>
						<span class="label-text">End Date</span>
						<input name="end_date" type="date" />
					</label>
					<label class="checkbox">
						<input type="checkbox" name="is_current" />
						<span class="label-text">Current Role</span>
					</label>
					<label>
						<span class="label-text">Order</span>
						<input name="sort_order" type="number" value="0" />
					</label>
					<label class="full">
						<span class="label-text">Description</span>
						<textarea name="description" rows="3" placeholder="What did you do?"></textarea>
					</label>
					<label class="full">
						<span class="label-text">Tech Stack (comma separated)</span>
						<input name="tech_stack" placeholder="Java, TypeScript, Python" />
					</label>
					<div class="row-actions">
						<button type="submit" class="btn-primary">Add Experience</button>
						<button type="button" class="btn-ghost" on:click={() => (showNewExperience = false)}>Cancel</button>
					</div>
				</form>
			{:else}
				<button type="button" class="add-btn" on:click={() => (showNewExperience = true)}>
					<span class="add-icon">+</span> Add Experience
				</button>
			{/if}
		</section>

		<div class="admin-footer">
			<span>✦ ✦ ✦</span>
			<span>Admin Dashboard · {new Date().getFullYear()}</span>
		</div>
	</div>
{/if}

<style>
	/* CSS Variables - Inherit from layout */
	:global(:root) {
		--bg-primary: #ffffff;
		--bg-secondary: #f8f6f4;
		--bg-tertiary: #faf8f6;
		--bg-hover: #fdf6f0;
		--text-primary: #1a1d24;
		--text-secondary: #3d3f47;
		--text-muted: #6b6f7a;
		--border-color: #f0edea;
		--border-hover: #e8e3de;
		--accent: #d4762a;
		--accent-light: #fdf6f0;
		--shadow: rgba(0, 0, 0, 0.06);
		--shadow-hover: rgba(212, 118, 42, 0.10);
		--badge-bg: #fdf6f0;
		--card-bg: #faf8f6;
		--gradient-start: #d4762a;
		--gradient-end: #f0a050;
	}

	:global([data-theme='dark']) {
		--bg-primary: #14161a;
		--bg-secondary: #1a1d24;
		--bg-tertiary: #24282f;
		--bg-hover: #2a1f15;
		--text-primary: #e8e6e3;
		--text-secondary: #b8b4ae;
		--text-muted: #8a8680;
		--border-color: #2a2d35;
		--border-hover: #3d3f47;
		--accent: #e68a2e;
		--accent-light: #2a1f15;
		--shadow: rgba(0, 0, 0, 0.3);
		--shadow-hover: rgba(230, 138, 46, 0.15);
		--badge-bg: #2a1f15;
		--card-bg: #1a1d24;
		--gradient-start: #e68a2e;
		--gradient-end: #f0a050;
	}

	/* Login */
	.login-wrap {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		background: var(--bg-secondary);
	}

	.login-container {
		width: 100%;
		max-width: 380px;
		position: relative;
	}

	.login-decoration {
		font-size: 2rem;
		text-align: center;
		color: var(--accent);
		margin-bottom: 0.5rem;
		animation: twinkle 2s ease-in-out infinite;
	}

	@keyframes twinkle {
		0%, 100% { opacity: 1; transform: scale(1); }
		50% { opacity: 0.6; transform: scale(1.2); }
	}

	.login-panel {
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: 16px;
		padding: 2.5rem 2rem;
		box-shadow: 0 4px 48px var(--shadow);
		position: relative;
		overflow: hidden;
	}

	.login-panel::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end), var(--gradient-start));
		background-size: 200% 100%;
		animation: shimmer 3s ease-in-out infinite;
	}

	@keyframes shimmer {
		0%, 100% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
	}

	.login-panel h1 {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
	}

	.hint {
		color: var(--text-muted);
		font-size: 0.85rem;
		margin: 0 0 1.25rem;
	}

	.input-group {
		margin-bottom: 1rem;
	}

	/* Dashboard */
	.dashboard {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem clamp(1.25rem, 4vw, 2rem) 5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border-color);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.header-left .sparkle {
		color: var(--accent);
		animation: twinkle 2s ease-in-out infinite;
	}

	.dashboard-header h1 {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.view-link {
		font-size: 0.85rem;
		color: var(--text-muted);
		transition: color 0.2s;
	}

	.view-link:hover {
		color: var(--accent);
	}

	/* Form Messages */
	.form-message {
		padding: 0.75rem 1rem;
		border-radius: 8px;
		margin-bottom: 1rem;
		font-weight: 500;
	}

	.form-message.success {
		background: #f0faf5;
		color: #12805c;
		border-left: 4px solid #12805c;
	}

	.form-message.error {
		background: #fef2f0;
		color: #d92d20;
		border-left: 4px solid #d92d20;
	}

	/* Panels */
	.panel {
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: 12px;
		padding: 1.75rem;
		box-shadow: 0 2px 12px var(--shadow);
		transition: border-color 0.2s;
	}

	.panel:hover {
		border-color: var(--border-hover);
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.section-title {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.section-badge {
		font-size: 1.2rem;
	}

	/* Forms */
	.grid-form {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.9rem 1rem;
		margin-top: 0.75rem;
	}

	.grid-form label {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.label-text {
		font-size: 0.78rem;
		font-weight: 500;
		color: var(--text-muted);
		letter-spacing: 0.02em;
	}

	.grid-form label.full {
		grid-column: 1 / -1;
	}

	.grid-form label.checkbox {
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
	}

	.grid-form label.checkbox input {
		width: auto;
	}

	input,
	textarea {
		width: 100%;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		color: var(--text-primary);
		font-family: inherit;
		font-size: 0.9rem;
		padding: 0.55rem 0.7rem;
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	input:focus,
	textarea:focus {
		border-color: var(--accent);
		box-shadow: 0 0 0 3px rgba(212, 118, 42, 0.1);
		outline: none;
	}

	.row-actions {
		grid-column: 1 / -1;
		display: flex;
		gap: 0.75rem;
		margin-top: 0.25rem;
	}

	/* Buttons */
	.btn-primary {
		background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
		color: #ffffff;
		border: none;
		border-radius: 8px;
		padding: 0.6rem 1.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		box-shadow: 0 2px 12px rgba(212, 118, 42, 0.2);
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 24px rgba(212, 118, 42, 0.3);
	}

	.btn-full {
		width: 100%;
		justify-content: center;
	}

	.btn-ghost {
		background: transparent;
		color: var(--text-muted);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 0.6rem 1.2rem;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-ghost:hover {
		color: var(--text-primary);
		border-color: var(--accent);
		background: var(--bg-hover);
	}

	.btn-small {
		padding: 0.3rem 0.8rem;
		font-size: 0.75rem;
	}

	.btn-danger {
		background: transparent;
		color: #d92d20;
		border: 1px solid #d92d20;
		border-radius: 8px;
		padding: 0.3rem 0.8rem;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-danger:hover {
		background: #d92d20;
		color: #ffffff;
	}

	.btn-outline {
		background: transparent;
		color: var(--text-muted);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 0.5rem 1.2rem;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-outline:hover {
		color: var(--text-primary);
		border-color: var(--accent);
	}

	/* Manage List */
	.manage-list {
		list-style: none;
		padding: 0;
		margin: 0.75rem 0 0;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		padding: 0.6rem 0.9rem;
		transition: border-color 0.2s;
	}

	.row:hover {
		border-color: var(--border-hover);
	}

	.row-title {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-primary);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.project-icon {
		font-size: 0.9rem;
	}

	.featured-badge {
		font-size: 0.8rem;
	}

	.image-indicator {
		font-size: 0.7rem;
		opacity: 0.6;
	}

	.row .row-actions {
		display: flex;
		gap: 0.6rem;
		margin: 0;
		grid-column: auto;
	}

	.row form {
		display: contents;
	}

	/* Add Button */
	.add-btn {
		margin-top: 1rem;
		background: transparent;
		border: 2px dashed var(--border-color);
		border-radius: 8px;
		color: var(--accent);
		padding: 0.75rem;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		width: 100%;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.add-btn:hover {
		border-color: var(--accent);
		background: var(--bg-hover);
	}

	.add-icon {
		font-size: 1.2rem;
	}

	/* New Form */
	.new-form {
		margin-top: 1.25rem;
		padding-top: 1.25rem;
		border-top: 1px dashed var(--border-color);
	}

	.edit-form {
		margin-top: 0;
		padding: 1rem;
		background: var(--bg-secondary);
		border-radius: 8px;
	}

	/* Image Upload */
	.image-preview {
		position: relative;
		width: 100%;
		max-width: 400px;
		border-radius: 8px;
		overflow: hidden;
		margin-bottom: 0.5rem;
		border: 1px solid var(--border-color);
	}

	.image-preview img {
		width: 100%;
		height: auto;
		display: block;
		max-height: 300px;
		object-fit: cover;
	}

	.image-actions {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 1rem;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
		display: flex;
		gap: 0.5rem;
		justify-content: center;
	}

	.change-image-btn {
		background: rgba(255, 255, 255, 0.9);
		color: var(--text-primary);
		padding: 0.3rem 1rem;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 500;
		transition: all 0.2s;
	}

	.change-image-btn:hover {
		background: #ffffff;
	}

	.change-image-btn input {
		display: none;
	}

	.remove-image-btn {
		background: rgba(217, 45, 32, 0.9);
		color: #ffffff;
		border: none;
		padding: 0.3rem 1rem;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 500;
		transition: all 0.2s;
	}

	.remove-image-btn:hover {
		background: #d92d20;
	}

	.image-upload-area {
		border: 2px dashed var(--border-color);
		border-radius: 8px;
		padding: 1.5rem;
		text-align: center;
		transition: all 0.2s;
	}

	.image-upload-area:hover {
		border-color: var(--accent);
		background: var(--bg-hover);
	}

	.image-upload-area input[type="file"] {
		display: block;
		margin: 0 auto 0.5rem;
		width: 100%;
	}

	.error {
		color: #d92d20;
		font-size: 0.85rem;
		margin-top: 0.75rem;
		padding: 0.5rem 0.75rem;
		background: #fef2f0;
		border-radius: 6px;
		border-left: 3px solid #d92d20;
	}

	/* Admin Footer */
	.admin-footer {
		text-align: center;
		font-size: 0.75rem;
		color: var(--text-muted);
		opacity: 0.5;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding-top: 0.5rem;
	}

	.admin-footer span:first-child {
		font-size: 0.6rem;
		letter-spacing: 0.5em;
	}

	/* Responsive */
	@media (max-width: 560px) {
		.grid-form {
			grid-template-columns: 1fr;
		}

		.dashboard-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.header-left {
			flex-wrap: wrap;
		}

		.panel {
			padding: 1.25rem;
		}

		.login-panel {
			padding: 1.75rem 1.25rem;
		}

		.row {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.row .row-actions {
			width: 100%;
			justify-content: flex-start;
		}
	}
</style>