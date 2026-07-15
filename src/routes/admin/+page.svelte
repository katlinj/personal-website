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
		<form method="POST" action="?/login" use:enhance class="panel">
			<h1>/admin</h1>
			<p class="hint">// enter password to edit this site</p>
			<input
				type="password"
				name="password"
				placeholder="password"
				autocomplete="current-password"
				required
			/>
			<button type="submit">$ login</button>
			{#if form?.error}<p class="error">{form.error}</p>{/if}
		</form>
	</div>
{:else}
	<div class="dashboard">
		<header>
			<div>
				<h1>admin</h1>
				<a href="/" class="view-link">← view site</a>
			</div>
			<form method="POST" action="?/logout">
				<button type="submit" class="ghost">$ logout</button>
			</form>
		</header>

		<section class="panel">
			<h2 class="section-label">// profile</h2>
			<form method="POST" action="?/saveProfile" use:enhance class="grid-form">
				<label>name<input name="name" value={profile.name ?? ''} /></label>
				<label>role<input name="role" value={profile.role ?? ''} /></label>
				<label>location<input name="location" value={profile.location ?? ''} /></label>
				<label>email<input name="email" value={profile.email ?? ''} /></label>
				<label>github url<input name="github_url" value={profile.github_url ?? ''} /></label>
				<label>linkedin url<input name="linkedin_url" value={profile.linkedin_url ?? ''} /></label>
				<label>resume url<input name="resume_url" value={profile.resume_url ?? ''} /></label>
				<label class="full"
					>bio<textarea name="bio" rows="4">{profile.bio ?? ''}</textarea></label
				>
				<label class="full"
					>skills (comma separated)<input
						name="skills"
						value={(profile.skills ?? []).join(', ')}
					/></label
				>
				<div class="row-actions"><button type="submit">$ save profile</button></div>
			</form>
			{#if form?.saved === 'profile'}<p class="success">saved.</p>{/if}
		</section>

		<section class="panel">
			<h2 class="section-label">// projects</h2>
			<ul class="manage-list">
				{#each projects as p (p.id)}
					<li>
						{#if editingProjectId === p.id}
							<form
								method="POST"
								action="?/saveProject"
								use:enhance={closeProjectForm}
								class="grid-form"
							>
								<input type="hidden" name="id" value={p.id} />
								<label>title<input name="title" value={p.title} required /></label>
								<label>order<input name="sort_order" type="number" value={p.sort_order ?? 0} /></label>
								<label class="full"
									>description<textarea name="description" rows="3">{p.description}</textarea
									></label
								>
								<label class="full"
									>tech (comma separated)<input
										name="tech_stack"
										value={(p.tech_stack ?? []).join(', ')}
									/></label
								>
								<label>live url<input name="project_url" value={p.project_url ?? ''} /></label>
								<label>source url<input name="github_url" value={p.github_url ?? ''} /></label>
								<label class="checkbox"
									><input type="checkbox" name="featured" checked={p.featured} /> featured</label
								>
								<div class="row-actions">
									<button type="submit">$ save</button>
									<button type="button" class="ghost" on:click={() => (editingProjectId = null)}
										>cancel</button
									>
								</div>
							</form>
						{:else}
							<div class="row">
								<span class="row-title">{p.title}</span>
								<div class="row-actions">
									<button type="button" class="ghost" on:click={() => (editingProjectId = p.id)}
										>edit</button
									>
									<form method="POST" action="?/deleteProject" use:enhance>
										<input type="hidden" name="id" value={p.id} />
										<button type="submit" class="ghost danger">delete</button>
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
				>
					<label>title<input name="title" required /></label>
					<label>order<input name="sort_order" type="number" value="0" /></label>
					<label class="full">description<textarea name="description" rows="3"></textarea></label>
					<label class="full">tech (comma separated)<input name="tech_stack" /></label>
					<label>live url<input name="project_url" /></label>
					<label>source url<input name="github_url" /></label>
					<label class="checkbox"><input type="checkbox" name="featured" /> featured</label>
					<div class="row-actions">
						<button type="submit">$ add project</button>
						<button type="button" class="ghost" on:click={() => (showNewProject = false)}
							>cancel</button
						>
					</div>
				</form>
			{:else}
				<button type="button" class="add-btn" on:click={() => (showNewProject = true)}
					>+ add project</button
				>
			{/if}
		</section>

		<section class="panel">
			<h2 class="section-label">// experience</h2>
			<ul class="manage-list">
				{#each experience as e (e.id)}
					<li>
						{#if editingExperienceId === e.id}
							<form
								method="POST"
								action="?/saveExperience"
								use:enhance={closeExperienceForm}
								class="grid-form"
							>
								<input type="hidden" name="id" value={e.id} />
								<label>company<input name="company" value={e.company} required /></label>
								<label>role<input name="role" value={e.role} required /></label>
								<label
									>start date<input
										name="start_date"
										type="date"
										value={e.start_date ?? ''}
									/></label
								>
								<label>end date<input name="end_date" type="date" value={e.end_date ?? ''} /></label>
								<label class="checkbox"
									><input type="checkbox" name="is_current" checked={e.is_current} /> current role</label
								>
								<label>order<input name="sort_order" type="number" value={e.sort_order ?? 0} /></label>
								<label class="full"
									>description<textarea name="description" rows="3">{e.description}</textarea
									></label
								>
								<label class="full"
									>tech (comma separated)<input
										name="tech_stack"
										value={(e.tech_stack ?? []).join(', ')}
									/></label
								>
								<div class="row-actions">
									<button type="submit">$ save</button>
									<button
										type="button"
										class="ghost"
										on:click={() => (editingExperienceId = null)}>cancel</button
									>
								</div>
							</form>
						{:else}
							<div class="row">
								<span class="row-title">{e.role} @ {e.company}</span>
								<div class="row-actions">
									<button
										type="button"
										class="ghost"
										on:click={() => (editingExperienceId = e.id)}>edit</button
									>
									<form method="POST" action="?/deleteExperience" use:enhance>
										<input type="hidden" name="id" value={e.id} />
										<button type="submit" class="ghost danger">delete</button>
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
					<label>company<input name="company" required /></label>
					<label>role<input name="role" required /></label>
					<label>start date<input name="start_date" type="date" /></label>
					<label>end date<input name="end_date" type="date" /></label>
					<label class="checkbox"><input type="checkbox" name="is_current" /> current role</label>
					<label>order<input name="sort_order" type="number" value="0" /></label>
					<label class="full">description<textarea name="description" rows="3"></textarea></label>
					<label class="full">tech (comma separated)<input name="tech_stack" /></label>
					<div class="row-actions">
						<button type="submit">$ add experience</button>
						<button type="button" class="ghost" on:click={() => (showNewExperience = false)}
							>cancel</button
						>
					</div>
				</form>
			{:else}
				<button type="button" class="add-btn" on:click={() => (showNewExperience = true)}
					>+ add experience</button
				>
			{/if}
		</section>
	</div>
{/if}

<style>
	.login-wrap {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
	}

	.panel {
		background: var(--panel);
		border: 1px solid var(--panel-border);
		border-radius: 8px;
		padding: 1.75rem;
	}

	.login-wrap form {
		width: 100%;
		max-width: 320px;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.hint {
		font-family: var(--mono);
		color: var(--muted);
		font-size: 0.85rem;
		margin: 0 0 0.5rem;
	}

	input,
	textarea {
		width: 100%;
		background: #0d0f14;
		border: 1px solid var(--panel-border);
		border-radius: 6px;
		color: var(--text);
		font-family: var(--sans);
		font-size: 0.95rem;
		padding: 0.55rem 0.7rem;
	}

	input:focus,
	textarea:focus {
		border-color: var(--accent);
	}

	button {
		background: var(--accent);
		color: #0d0f14;
		border: none;
		border-radius: 6px;
		padding: 0.55rem 1rem;
		font-size: 0.9rem;
		font-weight: 600;
	}

	button.ghost {
		background: transparent;
		color: var(--muted);
		border: 1px solid var(--panel-border);
	}

	button.ghost:hover {
		color: var(--text);
		border-color: var(--accent);
	}

	button.danger:hover {
		color: #ef6c6c;
		border-color: #ef6c6c;
	}

	.error {
		color: #ef6c6c;
		font-family: var(--mono);
		font-size: 0.85rem;
	}

	.success {
		color: #8fbf7f;
		font-family: var(--mono);
		font-size: 0.85rem;
	}

	.dashboard {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem clamp(1.25rem, 4vw, 2rem) 5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.view-link {
		font-family: var(--mono);
		font-size: 0.8rem;
		color: var(--muted);
	}

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
		font-family: var(--mono);
		font-size: 0.78rem;
		color: var(--muted);
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

	.row-actions {
		grid-column: 1 / -1;
		display: flex;
		gap: 0.75rem;
	}

	.new-form {
		margin-top: 1.25rem;
		padding-top: 1.25rem;
		border-top: 1px dashed var(--panel-border);
	}

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
		background: #0d0f14;
		border: 1px solid var(--panel-border);
		border-radius: 6px;
		padding: 0.6rem 0.9rem;
	}

	.row-title {
		font-family: var(--mono);
		font-size: 0.9rem;
	}

	.row .row-actions {
		display: flex;
		gap: 0.6rem;
	}

	.row form {
		display: contents;
	}

	.add-btn {
		margin-top: 1rem;
		background: transparent;
		border: 1px dashed var(--panel-border);
		color: var(--accent);
		width: 100%;
	}

	.add-btn:hover {
		border-color: var(--accent);
	}

	@media (max-width: 560px) {
		.grid-form {
			grid-template-columns: 1fr;
		}
	}
</style>
