<script>
	import { onMount } from 'svelte';

	// Constants for fallback values
	const FALLBACK = {
		name: 'Kathleen',
		role: 'Software Engineer',
		bio: 'I build scalable backend systems and developer tooling. Currently completing my CS degree at UP Diliman.'
	};

	export let data;

	$: profile = data?.profile ?? {};
	$: projects = data?.projects ?? [];
	$: experience = data?.experience ?? [];

	const sections = [
		{ id: 'about', label: 'About' },
		{ id: 'work', label: 'Work' },
		{ id: 'experience', label: 'Experience' },
		{ id: 'contact', label: 'Contact' }
	];

	let activeSection = 'about';
	let theme = 'light';
	let mounted = false;
	let activeProject = null;

	function openProject(p) {
		activeProject = p;
		if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
	}

	function closeProject() {
		activeProject = null;
		if (typeof document !== 'undefined') document.body.style.overflow = '';
	}

	function handleWindowKeydown(e) {
		if (e.key === 'Escape' && activeProject) closeProject();
	}

	function handleRowKeydown(e, p) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			openProject(p);
		}
	}

	// Theme management functions
	function getInitialTheme() {
		if (typeof localStorage === 'undefined' || typeof window === 'undefined') {
			return 'light';
		}

		try {
			const saved = localStorage.getItem('theme');
			if (saved === 'dark' || saved === 'light') {
				return saved;
			}

			return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		} catch (error) {
			console.error('Failed to get theme preference:', error);
			return 'light';
		}
	}

	function applyTheme(newTheme) {
		try {
			document.documentElement.setAttribute('data-theme', newTheme);
			localStorage.setItem('theme', newTheme);
			theme = newTheme;
		} catch (error) {
			console.error('Failed to apply theme:', error);
		}
	}

	function toggleTheme() {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		applyTheme(newTheme);
	}

	// Date formatting utilities
	function formatDate(d) {
		if (!d) return '';
		try {
			return new Date(d).toLocaleDateString('en-US', {
				month: 'short',
				year: 'numeric'
			});
		} catch (error) {
			console.error('Failed to format date:', error);
			return '';
		}
	}

	function formatRange(start, end, isCurrent) {
		const from = formatDate(start);
		const to = isCurrent ? 'Present' : formatDate(end) || 'Present';
		return from ? `${from} — ${to}` : to;
	}

	onMount(() => {
		mounted = true;
		const initialTheme = getInitialTheme();
		applyTheme(initialTheme);

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.find((entry) => entry.isIntersecting);
				if (visible) {
					activeSection = visible.target.id;
				}
			},
			{ rootMargin: '-40% 0px -50% 0px', threshold: 0.1 }
		);

		sections.forEach(({ id }) => {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		});

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>{profile?.name || FALLBACK.name} — Portfolio</title>
	{#if profile?.bio}
		<meta name="description" content={profile.bio} />
	{:else}
		<meta name="description" content={FALLBACK.bio} />
	{/if}
</svelte:head>

<svelte:window on:keydown={handleWindowKeydown} />

<div class="page">
	<!-- Header -->
	<header class="header">
		<div class="header-inner">
			<a href="#about" class="logo">{profile?.name || FALLBACK.name}</a>
			<nav class="nav">
				{#each sections as s}
					<a href="#{s.id}" class:active={activeSection === s.id}>{s.label}</a>
				{/each}
				<a href="/admin" class="admin">Admin</a>
				{#if mounted}
					<button class="theme-toggle" on:click={toggleTheme} aria-label="Toggle theme">
						{theme === 'dark' ? 'Light' : 'Dark'}
					</button>
				{/if}
			</nav>
		</div>
	</header>

	<main class="container">
		<!-- Hero Section -->
		<section id="about" class="hero">
			<p class="eyebrow"><span class="dot"></span>Available for opportunities</p>
			<h1>{profile?.name || FALLBACK.name}</h1>
			<p class="role">{profile?.role || FALLBACK.role}</p>
			{#if profile?.bio}
				<p class="bio">{profile.bio}</p>
			{:else}
				<p class="bio">{FALLBACK.bio}</p>
			{/if}

			<div class="actions">
				<a href="#work" class="action-link">View my work →</a>
				{#if profile?.email}
					<a href="mailto:{profile.email}" class="action-link">Download Resume →</a>
				{/if}
			</div>

			{#if profile?.skills?.length}
				<div class="skills">
					{#each profile.skills as skill, i}
						<span class="skill">{skill}</span>{#if i < profile.skills.length - 1}<span class="skill-sep">·</span>{/if}
					{/each}
				</div>
			{/if}
		</section>

		<!-- Work Section -->
		<section id="work" class="section">
			<p class="eyebrow section-eyebrow">Work</p>
			{#if projects.length}
				<div class="grid">
					{#each projects as p (p.id)}
						<article
							class="card"
							role="button"
							tabindex="0"
							aria-haspopup="dialog"
							on:click={() => openProject(p)}
							on:keydown={(e) => handleRowKeydown(e, p)}
						>
							{#if p.image_url}
								<div class="card-image">
									<img src={p.image_url} alt={p.title} loading="lazy" />
								</div>
							{:else}
								<div class="card-image card-image-empty" aria-hidden="true">
									{p.title?.[0] ?? '?'}
								</div>
							{/if}
							<div class="card-body">
								<div class="row-head">
									<h3>{p.title}</h3>
									{#if p.featured}<span class="tag">Featured</span>{/if}
								</div>
								{#if p.description}<p class="desc">{p.description}</p>{/if}
								{#if p.tech_stack?.length}
									<p class="stack">{p.tech_stack.join(' · ')}</p>
								{/if}
								<div class="card-bottom">
									<span class="details-link">View details →</span>
									<div
										class="row-links"
										on:click|stopPropagation
										on:keydown|stopPropagation
									>
										{#if p.project_url}
											<a href={p.project_url} target="_blank" rel="noreferrer">Live ↗</a>
										{/if}
										{#if p.github_url}
											<a href={p.github_url} target="_blank" rel="noreferrer">Source ↗</a>
										{/if}
									</div>
								</div>
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<p class="empty">No projects yet — add some from <a href="/admin">/admin</a>.</p>
			{/if}
		</section>

		<!-- Experience Section -->
		<section id="experience" class="section">
			<p class="eyebrow section-eyebrow">Experience</p>
			{#if experience.length}
				<div class="list">
					{#each experience as e (e.id)}
						<div class="row exp-row">
							<span class="exp-date">{formatRange(e.start_date, e.end_date, e.is_current)}</span>
							<div class="row-content">
								<h3>{e.role}</h3>
								<p class="company">{e.company}</p>
								{#if e.description}<p class="desc">{e.description}</p>{/if}
								{#if e.tech_stack?.length}
									<p class="stack">{e.tech_stack.join(' · ')}</p>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p class="empty">No experience yet — add some from <a href="/admin">/admin</a>.</p>
			{/if}
		</section>

		<!-- Contact Section -->
		<footer id="contact" class="section">
			<p class="eyebrow section-eyebrow">Contact</p>
			<div class="contact-links">
				{#if profile?.email}
					<a href="mailto:{profile.email}" class="contact-link">Email</a>
				{/if}
				{#if profile?.github_url}
					<a href={profile.github_url} target="_blank" rel="noreferrer" class="contact-link">GitHub</a>
				{/if}
				{#if profile?.linkedin_url}
					<a href={profile.linkedin_url} target="_blank" rel="noreferrer" class="contact-link">LinkedIn</a>
				{/if}
				{#if profile?.resume_url}
					<a href={profile.resume_url} target="_blank" rel="noreferrer" class="contact-link">Resume</a>
				{/if}
			</div>

			<div class="footer">
				<span>© 2026 {profile?.name || FALLBACK.name}</span>
				<span class="footer-sep">Built with SvelteKit</span>
			</div>
		</footer>
	</main>

	<!-- Project detail modal -->
	{#if activeProject}
		<div class="modal-backdrop" on:click={closeProject}>
			<div
				class="modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-title"
				on:click|stopPropagation
			>
				<button class="modal-close" on:click={closeProject} aria-label="Close">✕</button>

				{#if activeProject.image_url}
					<div class="modal-image">
						<img src={activeProject.image_url} alt={activeProject.title} />
					</div>
				{/if}

				<div class="modal-body">
					<div class="row-head">
						<h2 id="modal-title">{activeProject.title}</h2>
						{#if activeProject.featured}<span class="tag">Featured</span>{/if}
					</div>

					{#if activeProject.description}
						<p class="modal-desc">{activeProject.description}</p>
					{/if}

					{#if activeProject.details}
						<p class="modal-details">{activeProject.details}</p>
					{/if}

					{#if activeProject.tech_stack?.length}
						<p class="stack">{activeProject.tech_stack.join(' · ')}</p>
					{/if}

					<div class="modal-links">
						{#if activeProject.project_url}
							<a href={activeProject.project_url} target="_blank" rel="noreferrer" class="action-link">View live →</a>
						{/if}
						{#if activeProject.github_url}
							<a href={activeProject.github_url} target="_blank" rel="noreferrer" class="action-link">Source →</a>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.page {
		min-height: 100vh;
	}

	/* Header */
	.header {
		position: sticky;
		top: 0;
		z-index: 50;
		background: var(--bg);
		border-bottom: 1px solid var(--line);
		backdrop-filter: blur(6px);
	}

	.header-inner {
		max-width: 720px;
		margin: 0 auto;
		padding: 1.25rem 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.logo {
		font-weight: 600;
		font-size: 0.95rem;
		letter-spacing: -0.01em;
		color: var(--ink);
	}

	.nav {
		display: flex;
		gap: 1.5rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.nav a {
		color: var(--ink-faint);
		font-size: 0.85rem;
		font-weight: 500;
		transition: color 0.15s ease;
		padding: 0.2rem 0;
		position: relative;
	}

	.nav a:hover {
		color: var(--ink);
	}

	.nav a.active {
		color: var(--ink);
	}

	.nav a.active::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		right: 0;
		height: 1px;
		background: var(--ink);
	}

	.nav .admin {
		font-size: 0.75rem;
		padding: 0.25rem 0.7rem;
		border: 1px solid var(--line-strong);
	}

	.nav .admin:hover {
		border-color: var(--ink-faint);
		color: var(--ink);
	}

	.theme-toggle {
		background: transparent;
		border: 1px solid var(--line-strong);
		font: inherit;
		font-size: 0.75rem;
		color: var(--ink-faint);
		padding: 0.25rem 0.7rem;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.theme-toggle:hover {
		border-color: var(--ink-faint);
		color: var(--ink);
	}

	/* Container */
	.container {
		max-width: 720px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.eyebrow {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink-faint);
	}

	.eyebrow .dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
		flex-shrink: 0;
	}

	.section-eyebrow {
		margin-bottom: 1.25rem;
	}

	/* Hero */
	.hero {
		padding: 3.5rem 0 3rem;
	}

	.hero .eyebrow {
		margin-bottom: 1.25rem;
	}

	.hero h1 {
		font-size: 2.75rem;
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.1;
		color: var(--ink);
		margin-bottom: 0.4rem;
	}

	.hero .role {
		font-size: 1.15rem;
		color: var(--ink-soft);
		font-weight: 500;
		margin-bottom: 1.25rem;
	}

	.hero .bio {
		font-size: 1rem;
		color: var(--ink-soft);
		max-width: 520px;
		margin-bottom: 2rem;
		line-height: 1.75;
	}

	.actions {
		display: flex;
		gap: 1.75rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.action-link {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--ink);
		border-bottom: 1px solid var(--ink);
		padding-bottom: 2px;
		transition: opacity 0.15s ease;
	}

	.action-link:hover {
		opacity: 0.6;
	}

	.skills {
		font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.8rem;
		color: var(--ink-faint);
		line-height: 1.9;
	}

	.skill-sep {
		margin: 0 0.45rem;
		color: var(--line-strong);
	}

	/* Section */
	.section {
		padding: 2.75rem 0;
		border-top: 1px solid var(--line);
	}

	.list {
		display: flex;
		flex-direction: column;
	}

	.row {
		display: flex;
		gap: 1.25rem;
		padding: 1.5rem 0;
		border-top: 1px solid var(--line);
	}

	.row:first-child {
		border-top: none;
		padding-top: 0;
	}

	/* Project cards */
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 1.5rem;
	}

	.card {
		cursor: pointer;
		display: flex;
		flex-direction: column;
		border: 1px solid var(--line);
		background: var(--bg);
		transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
	}

	.card:hover,
	.card:focus-visible {
		border-color: var(--line-strong);
		transform: translateY(-3px);
		box-shadow: 0 12px 28px rgba(17, 17, 17, 0.08);
	}

	.card:hover .details-link,
	.card:focus-visible .details-link {
		color: var(--ink);
	}

	.card:hover .details-link::after,
	.card:focus-visible .details-link::after {
		transform: translateX(3px);
	}

	.card-image {
		width: 100%;
		height: 170px;
		flex-shrink: 0;
		background: var(--bg-raised);
		overflow: hidden;
		border-bottom: 1px solid var(--line);
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.card:hover .card-image img {
		transform: scale(1.03);
	}

	.card-image-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 1.6rem;
		color: var(--ink-faint);
		text-transform: uppercase;
	}

	.card-body {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.row-head {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-wrap: wrap;
	}

	.row h3,
	.card-body h3 {
		font-size: 1.05rem;
		font-weight: 600;
		color: var(--ink);
		letter-spacing: -0.01em;
	}

	.tag {
		font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.65rem;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--accent);
		background: var(--accent-soft);
		padding: 0.15rem 0.5rem;
	}

	.desc {
		font-size: 0.92rem;
		color: var(--ink-soft);
		margin-top: 0.35rem;
		line-height: 1.65;
	}

	.stack {
		font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.75rem;
		color: var(--ink-faint);
		margin-top: 0.6rem;
	}

	.card-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: auto;
		padding-top: 0.9rem;
	}

	.details-link {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--ink-faint);
		transition: color 0.15s ease;
		display: inline-flex;
		align-items: center;
	}

	.details-link::after {
		content: '';
		display: inline-block;
		width: 0;
		transition: transform 0.15s ease;
	}

	.row-links {
		display: flex;
		gap: 1.1rem;
	}

	.row-links a {
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--ink-soft);
		border-bottom: 1px solid transparent;
		transition: all 0.15s ease;
	}

	.row-links a:hover {
		color: var(--ink);
		border-bottom-color: var(--ink);
	}

	/* Experience rows still use the plain list layout */
	.row-content {
		flex: 1;
		min-width: 0;
	}

	/* Experience specific */
	.exp-row {
		align-items: baseline;
	}

	.exp-date {
		font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.8rem;
		color: var(--ink-faint);
		flex-shrink: 0;
		width: 140px;
	}

	.company {
		font-size: 0.9rem;
		color: var(--ink-faint);
		margin-top: 0.15rem;
	}

	.empty {
		color: var(--ink-faint);
		font-size: 0.95rem;
	}

	.empty a {
		border-bottom: 1px solid var(--ink-faint);
	}

	/* Contact */
	.contact-links {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
		margin-bottom: 2.5rem;
	}

	.contact-link {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--ink);
		border-bottom: 1px solid var(--line-strong);
		padding-bottom: 2px;
		transition: all 0.15s ease;
	}

	.contact-link:hover {
		border-bottom-color: var(--ink);
		opacity: 0.7;
	}

	/* Footer */
	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--line);
		font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 0.75rem;
		color: var(--ink-faint);
	}

	/* Modal */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(8, 8, 8, 0.72);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 4rem 1.25rem;
		z-index: 200;
		overflow-y: auto;
	}

	.modal {
		background: var(--modal-bg);
		background-color: var(--modal-bg);
		opacity: 1;
		isolation: isolate;
		border: 1px solid var(--line-strong);
		max-width: 560px;
		width: 100%;
		position: relative;
		box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35), 0 4px 16px rgba(0, 0, 0, 0.2);
	}

	.modal-close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: var(--modal-bg);
		border: 1px solid var(--line-strong);
		width: 32px;
		height: 32px;
		font-size: 0.85rem;
		color: var(--ink-soft);
		cursor: pointer;
		z-index: 1;
		transition: all 0.15s ease;
	}

	.modal-close:hover {
		border-color: var(--ink-faint);
		color: var(--ink);
	}

	.modal-image {
		width: 100%;
		height: 220px;
		overflow: hidden;
		background: var(--bg-raised);
	}

	.modal-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.modal-body {
		padding: 2rem;
	}

	.modal-body .row-head {
		margin-bottom: 0.75rem;
	}

	.modal-body h2 {
		font-size: 1.4rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--ink);
	}

	.modal-desc {
		font-size: 0.95rem;
		color: var(--ink-soft);
		line-height: 1.7;
		margin-bottom: 1rem;
	}

	.modal-details {
		font-size: 0.9rem;
		color: var(--ink-soft);
		line-height: 1.75;
		white-space: pre-line;
		margin-bottom: 1.25rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--line);
	}

	.modal-links {
		display: flex;
		gap: 1.75rem;
		margin-top: 1.5rem;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.modal-backdrop {
			padding: 1.5rem 0.75rem;
		}

		.modal-body {
			padding: 1.5rem;
		}

		.header-inner {
			padding: 1rem;
		}

		.nav {
			gap: 1rem;
		}

		.hero {
			padding: 2.5rem 0 2rem;
		}

		.hero h1 {
			font-size: 2.1rem;
		}

		.container {
			padding: 0 1rem;
		}

		.row {
			flex-direction: column;
			gap: 0.75rem;
		}

		.grid {
			grid-template-columns: 1fr;
		}

		.exp-date {
			width: auto;
		}

		.footer {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>