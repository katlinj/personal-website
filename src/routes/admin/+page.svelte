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
			<div class="form-message success">Project saved.</div>
		{/if}
		{#if form?.deleted === 'project'}
			<div class="form-message success">Project deleted.</div>
		{/if}
		{#if form?.saved === 'experience'}
			<div class="form-message success">Experience saved.</div>
		{/if}
		{#if form?.deleted === 'experience'}
			<div class="form-message success">Experience deleted.</div>
		{/if}
		{#if form?.saved === 'profile'}
			<div class="form-message success">Profile saved.</div>
		{/if}

		<!-- Profile Section -->
		<section class="panel">
			<div class="panel-header">
				<h2 class="section-title">Profile</h2>
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
									{p.title}
									{#if p.featured}<span class="tag">Featured</span>{/if}
									{#if p.image_url}<span class="tag tag-muted">Image</span>{/if}
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
								<span class="row-title">{e.role} @ {e.company}</span>
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
			<span>Admin Dashboard · {new Date().getFullYear()}</span>
		</div>
	</div>
{/if}

<style>
	/* Login */
	.login-wrap {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		background: var(--bg);
	}

	.login-container {
		width: 100%;
		max-width: 380px;
	}

	.login-panel {
		background: var(--bg);
		border: 1px solid var(--line);
		padding: 2.5rem 2rem;
	}

	.login-panel h1 {
		font-size: 1.4rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--ink);
		margin-bottom: 0.25rem;
	}

	.hint {
		color: var(--ink-faint);
		font-size: 0.85rem;
		margin: 0 0 1.25rem;
	}

	.input-group {
		margin-bottom: 1rem;
	}

	/* Dashboard */
	.dashboard {
		max-width: 760px;
		margin: 0 auto;
		padding: 3rem clamp(1.25rem, 4vw, 1.5rem) 5rem;
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid var(--line);
	}

	.header-left {
		display: flex;
		align-items: baseline;
		gap: 1rem;
	}

	.dashboard-header h1 {
		font-size: 1.4rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--ink);
	}

	.view-link {
		font-size: 0.85rem;
		color: var(--ink-faint);
		transition: color 0.15s ease;
	}

	.view-link:hover {
		color: var(--ink);
	}

	/* Form Messages */
	.form-message {
		padding: 0.7rem 1rem;
		border: 1px solid var(--line-strong);
		border-left-width: 3px;
		margin-bottom: -1rem;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.form-message.success {
		color: var(--ink);
		border-left-color: var(--ink);
	}

	.form-message.error {
		color: #b3261e;
		border-left-color: #b3261e;
	}

	/* Panels */
	.panel {
		background: var(--bg);
		border: 1px solid var(--line);
		padding: 1.75rem;
	}

	.panel-header {
		margin-bottom: 1.25rem;
	}

	.section-title {
		font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}

	/* Forms */
	.grid-form {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem 1.25rem;
		margin-top: 0.75rem;
	}

	.grid-form label {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.label-text {
		font-size: 0.78rem;
		font-weight: 500;
		color: var(--ink-faint);
		letter-spacing: 0.01em;
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
		background: var(--bg);
		border: 1px solid var(--line-strong);
		border-radius: 0;
		color: var(--ink);
		font-family: inherit;
		font-size: 0.9rem;
		padding: 0.55rem 0.7rem;
		transition: border-color 0.15s ease;
	}

	input:focus,
	textarea:focus {
		border-color: var(--ink);
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
		background: var(--ink);
		color: var(--bg);
		border: 1px solid var(--ink);
		border-radius: 0;
		padding: 0.6rem 1.5rem;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.15s ease;
	}

	.btn-primary:hover {
		opacity: 0.75;
	}

	.btn-full {
		width: 100%;
		justify-content: center;
	}

	.btn-ghost {
		background: transparent;
		color: var(--ink-soft);
		border: 1px solid var(--line-strong);
		border-radius: 0;
		padding: 0.6rem 1.2rem;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-ghost:hover {
		color: var(--ink);
		border-color: var(--ink-faint);
	}

	.btn-small {
		padding: 0.3rem 0.8rem;
		font-size: 0.75rem;
	}

	.btn-danger {
		background: transparent;
		color: #b3261e;
		border: 1px solid #b3261e;
		border-radius: 0;
		padding: 0.3rem 0.8rem;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-danger:hover {
		background: #b3261e;
		color: #ffffff;
	}

	.btn-outline {
		background: transparent;
		color: var(--ink-soft);
		border: 1px solid var(--line-strong);
		border-radius: 0;
		padding: 0.5rem 1.2rem;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-outline:hover {
		color: var(--ink);
		border-color: var(--ink-faint);
	}

	/* Manage List */
	.manage-list {
		list-style: none;
		padding: 0;
		margin: 0.75rem 0 0;
		display: flex;
		flex-direction: column;
	}

	.manage-list li {
		border-top: 1px solid var(--line);
	}

	.manage-list li:first-child {
		border-top: none;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.85rem 0;
	}

	.row-title {
		font-size: 0.92rem;
		font-weight: 500;
		color: var(--ink);
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: wrap;
	}

	.tag {
		font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.62rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--accent);
		background: var(--accent-soft);
		padding: 0.12rem 0.45rem;
	}

	.tag-muted {
		color: var(--ink-faint);
		background: var(--bg-raised);
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
		margin-top: 1.25rem;
		background: transparent;
		border: 1px dashed var(--line-strong);
		border-radius: 0;
		color: var(--ink-soft);
		padding: 0.75rem;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		width: 100%;
		transition: all 0.15s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.add-btn:hover {
		border-color: var(--ink-faint);
		color: var(--ink);
	}

	.add-icon {
		font-size: 1rem;
	}

	/* New Form */
	.new-form {
		margin-top: 1.25rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--line);
	}

	.edit-form {
		margin-top: 0;
		padding: 1.25rem;
		background: var(--bg-raised);
	}

	/* Image Upload */
	.image-preview {
		position: relative;
		width: 100%;
		max-width: 400px;
		overflow: hidden;
		margin-bottom: 0.5rem;
		border: 1px solid var(--line);
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
		padding: 0.9rem;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.65));
		display: flex;
		gap: 0.5rem;
		justify-content: center;
	}

	.change-image-btn {
		background: rgba(255, 255, 255, 0.92);
		color: #111111;
		padding: 0.3rem 1rem;
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 500;
		transition: background 0.15s ease;
	}

	.change-image-btn:hover {
		background: #ffffff;
	}

	.change-image-btn input {
		display: none;
	}

	.remove-image-btn {
		background: rgba(179, 38, 30, 0.92);
		color: #ffffff;
		border: none;
		padding: 0.3rem 1rem;
		cursor: pointer;
		font-size: 0.8rem;
		font-weight: 500;
		transition: background 0.15s ease;
	}

	.remove-image-btn:hover {
		background: #b3261e;
	}

	.image-upload-area {
		border: 1px dashed var(--line-strong);
		padding: 1.5rem;
		text-align: center;
		transition: border-color 0.15s ease;
	}

	.image-upload-area:hover {
		border-color: var(--ink-faint);
	}

	.image-upload-area input[type='file'] {
		display: block;
		margin: 0 auto 0.5rem;
		width: 100%;
	}

	.error {
		color: #b3261e;
		font-size: 0.85rem;
		margin-top: 0.75rem;
		padding: 0.5rem 0.75rem;
		background: transparent;
		border-left: 3px solid #b3261e;
	}

	/* Admin Footer */
	.admin-footer {
		text-align: center;
		font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.72rem;
		color: var(--ink-faint);
		padding-top: 1.5rem;
		border-top: 1px solid var(--line);
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