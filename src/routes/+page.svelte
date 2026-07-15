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

			// Check system preference
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
		return from ? `${from} – ${to}` : to;
	}

	onMount(() => {
		mounted = true;
		const initialTheme = getInitialTheme();
		applyTheme(initialTheme);

		// Intersection Observer for active nav
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

<!-- Theme Toggle -->
{#if mounted}
	<button class="theme-toggle" on:click={toggleTheme} aria-label="Toggle theme">
		{theme === 'dark' ? '☀️' : '🌙'}
	</button>
{/if}

<div class="container">
	<!-- Header -->
	<header class="header">
		<span class="logo">
			<span class="sparkle">✦</span> 
			{profile?.name || FALLBACK.name}
			<span>Jocson</span>
		</span>
		<nav class="nav">
			{#each sections as s}
				<a href="#{s.id}" class:active={activeSection === s.id}>{s.label}</a>
			{/each}
			<a href="/admin" class="admin">Admin</a>
		</nav>
	</header>

	<!-- Hero Section -->
	<section id="about" class="hero">
		<span class="hero-badge">⚡ Available for opportunities</span>
		<h1>
			Hi, I'm <span class="highlight">{profile?.name || FALLBACK.name}</span>
		</h1>
		<p class="role">
			{profile?.role || FALLBACK.role}
		</p>
		{#if profile?.bio}
			<p class="bio">{profile.bio}</p>
		{:else}
			<p class="bio">{FALLBACK.bio}</p>
		{/if}

		<div class="actions">
			<a href="#work" class="btn btn-primary">View My Work</a>
			{#if profile?.email}
				<a href="mailto:{profile.email}" class="btn btn-outline">Let's Talk</a>
			{/if}
		</div>

		{#if profile?.skills?.length}
			<div class="skills">
				{#each profile.skills as skill}
					<span class="skill">{skill}</span>
				{/each}
			</div>
		{/if}
	</section>

	<hr class="divider" />

	<!-- Work Section -->
	<section id="work" class="section">
		<h2 class="section-title">Selected <span class="accent">Work</span></h2>
		{#if projects.length}
			<div class="grid">
				{#each projects as p (p.id)}
					<article class="project">
						{#if p.image_url}
							<div class="project-image-wrapper">
								<img src={p.image_url} alt={p.title} class="project-image" />
							</div>
						{/if}
						<div class="project-content">
							{#if p.featured}
								<span class="tag">⭐ Featured</span>
							{:else}
								<span class="tag">📦 Project</span>
							{/if}
							<h3>{p.title}</h3>
							{#if p.description}<p class="desc">{p.description}</p>{/if}
							{#if p.tech_stack?.length}
								<span class="stack">
									{#each p.tech_stack as tech, i}
										{#if i === 0}<span class="highlight">{tech}</span>{:else}{tech}{/if}
										{#if i < p.tech_stack.length - 1} · {/if}
									{/each}
								</span>
							{/if}
							<div class="project-links">
								{#if p.project_url}
									<a href={p.project_url} target="_blank" rel="noreferrer" class="project-link">
										View Live
									</a>
								{/if}
								{#if p.github_url}
									<a href={p.github_url} target="_blank" rel="noreferrer" class="project-link">
										Source
									</a>
								{/if}
							</div>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<p class="empty">No projects yet — add some from <a href="/admin">/admin</a>.</p>
		{/if}
	</section>

	<hr class="divider" />

	<!-- Experience Section -->
	<section id="experience" class="section">
		<h2 class="section-title"><span class="accent">Experience</span></h2>
		{#if experience.length}
			<div class="timeline">
				{#each experience as e (e.id)}
					<div class="timeline-item">
						<span class="timeline-year">{formatRange(e.start_date, e.end_date, e.is_current)}</span>
						<span class="timeline-content">
							{e.role}
							<span class="company">{e.company}</span>
						</span>
					</div>
				{/each}
			</div>
		{:else}
			<p class="empty">No experience yet — add some from <a href="/admin">/admin</a>.</p>
		{/if}
	</section>

	<hr class="divider" />

	<!-- Contact Section -->
	<footer id="contact" class="section">
		<h2 class="section-title">Let's <span class="accent">Connect</span></h2>
		<div class="contact-links">
			{#if profile?.github_url}
				<a href={profile.github_url} target="_blank" rel="noreferrer">GitHub</a>
			{/if}
			{#if profile?.linkedin_url}
				<a href={profile.linkedin_url} target="_blank" rel="noreferrer">LinkedIn</a>
			{/if}
			{#if profile?.email}
				<a href="mailto:{profile.email}">Email</a>
			{/if}
			{#if profile?.resume_url}
				<a href={profile.resume_url} target="_blank" rel="noreferrer">Resume</a>
			{/if}
		</div>

		<!-- Footer -->
		<div class="footer">
			<span>© 2026 {profile?.name || FALLBACK.name}</span>
			<span>
				Built with <a href="#">SvelteKit</a>
				<span class="dot">·</span>
				<a href="#">Source on GitHub</a>
				<span class="dot">·</span>
				<span class="heart">❤</span>
			</span>
		</div>
	</footer>
</div>

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

	/* Reset styles */
	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		margin: 0;
		padding: 2rem 1rem;
		background: var(--bg-secondary);
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, system-ui, sans-serif;
		color: var(--text-primary);
		line-height: 1.6;
		transition: background 0.3s ease, color 0.3s ease;
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}

	:global(a) {
		color: var(--accent);
		text-decoration: none;
		transition: color 0.2s;
	}

	:global(a:hover) {
		color: var(--accent);
	}

	:global(::selection) {
		background: var(--accent);
		color: #ffffff;
	}

	/* Container */
	.container {
		max-width: 960px;
		width: 100%;
		margin: 0 auto;
		background: var(--bg-primary);
		border-radius: 16px;
		box-shadow: 0 4px 48px var(--shadow), 0 1px 4px var(--shadow);
		padding: 2.5rem 3rem;
		transition: background 0.3s ease, box-shadow 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	/* Decorative accent line */
	.container::before {
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

	/* Theme Toggle */
	.theme-toggle {
		position: fixed;
		top: 1.5rem;
		right: 1.5rem;
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: 50%;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		color: var(--text-primary);
		font-size: 1.2rem;
		box-shadow: 0 2px 12px var(--shadow);
		z-index: 100;
		user-select: none;
	}

	.theme-toggle:hover {
		border-color: var(--accent);
		transform: scale(1.05) rotate(15deg);
	}

	.theme-toggle:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	/* Header */
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 1.5rem;
		margin-bottom: 2.5rem;
		border-bottom: 1px solid var(--border-color);
		transition: border-color 0.3s ease;
	}

	.logo {
		font-weight: 600;
		font-size: 1.1rem;
		color: var(--text-primary);
		letter-spacing: -0.01em;
		transition: color 0.3s ease;
	}

	.logo .sparkle {
		color: var(--accent);
		animation: twinkle 2s ease-in-out infinite;
		display: inline-block;
	}

	@keyframes twinkle {
		0%, 100% { opacity: 1; transform: scale(1); }
		50% { opacity: 0.6; transform: scale(1.2); }
	}

	.logo span {
		color: var(--accent);
	}

	.nav {
		display: flex;
		gap: 2rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.nav a {
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
		transition: color 0.2s;
		padding: 0.25rem 0;
		position: relative;
	}

	.nav a:hover {
		color: var(--text-primary);
	}

	.nav a.active {
		color: var(--accent);
	}

	.nav a.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--accent);
		border-radius: 2px;
	}

	.nav .admin {
		color: var(--text-muted);
		font-size: 0.8rem;
		padding: 0.3rem 1rem;
		border: 1px solid var(--border-color);
		border-radius: 20px;
		transition: all 0.2s;
	}

	.nav .admin:hover {
		border-color: var(--accent);
		color: var(--accent);
	}

	/* Hero */
	.hero {
		margin-bottom: 3.5rem;
		position: relative;
	}

	.hero::after {
		content: '✦ ✦ ✦';
		position: absolute;
		bottom: -1.5rem;
		right: 0;
		font-size: 0.6rem;
		color: var(--accent);
		opacity: 0.3;
		letter-spacing: 0.3em;
	}

	.hero-badge {
		display: inline-block;
		background: linear-gradient(135deg, var(--badge-bg), var(--accent-light));
		color: var(--accent);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		padding: 0.25rem 0.8rem;
		border-radius: 20px;
		margin-bottom: 1rem;
		animation: pulse-glow 2s ease-in-out infinite;
		transition: background 0.3s ease;
	}

	@keyframes pulse-glow {
		0%, 100% { box-shadow: 0 0 0 0 rgba(212, 118, 42, 0.1); }
		50% { box-shadow: 0 0 0 8px rgba(212, 118, 42, 0); }
	}

	.hero h1 {
		font-size: 2.8rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		margin-bottom: 0.25rem;
		color: var(--text-primary);
		transition: color 0.3s ease;
	}

	.hero h1 .highlight {
		background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		position: relative;
	}

	.hero h1 .highlight::after {
		content: '✦';
		font-size: 1.8rem;
		position: absolute;
		top: -0.8rem;
		right: -2.2rem;
		color: var(--accent);
		-webkit-text-fill-color: var(--accent);
		animation: spin 8s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.hero .role {
		font-size: 1.2rem;
		color: var(--text-muted);
		margin-bottom: 1rem;
		font-weight: 400;
		transition: color 0.3s ease;
	}

	.hero .role .accent {
		color: var(--accent);
		font-weight: 500;
		position: relative;
	}

	.hero .role .accent::before {
		content: '⚡';
		margin-right: 4px;
	}

	.hero .bio {
		font-size: 1.05rem;
		color: var(--text-muted);
		max-width: 550px;
		margin-bottom: 1.75rem;
		line-height: 1.7;
		border-left: 3px solid var(--accent);
		padding-left: 1rem;
		transition: color 0.3s ease, border-color 0.3s ease;
	}

	.actions {
		display: flex;
		gap: 0.8rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.btn {
		padding: 0.6rem 1.8rem;
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 500;
		border: none;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.btn-primary {
		background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
		color: #ffffff;
		box-shadow: 0 2px 12px rgba(212, 118, 42, 0.25);
	}

	.btn-primary:hover {
		transform: translateY(-2px) scale(1.02);
		box-shadow: 0 6px 24px rgba(212, 118, 42, 0.35);
	}

	.btn-primary::before {
		content: '↓';
		transition: transform 0.3s;
	}

	.btn-primary:hover::before {
		transform: translateY(2px);
	}

	.btn-outline {
		background: transparent;
		color: var(--text-primary);
		border: 1px solid var(--border-color);
		transition: all 0.3s;
	}

	.btn-outline:hover {
		border-color: var(--accent);
		color: var(--accent);
		background: var(--bg-hover);
		transform: translateY(-2px);
	}

	.btn-outline::before {
		content: '✉';
		transition: transform 0.3s;
	}

	.btn-outline:hover::before {
		transform: rotate(-10deg) scale(1.1);
	}

	.skills {
		display: flex;
		gap: 0.6rem;
		flex-wrap: wrap;
	}

	.skill {
		background: var(--bg-tertiary);
		color: var(--text-secondary);
		font-size: 0.8rem;
		padding: 0.3rem 0.9rem;
		border-radius: 6px;
		font-weight: 500;
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		cursor: default;
	}

	.skill::before {
		content: '#';
		color: var(--accent);
		opacity: 0.5;
		margin-right: 2px;
	}

	.skill:hover {
		background: var(--badge-bg);
		color: var(--accent);
		transform: translateY(-2px) scale(1.05);
		box-shadow: 0 4px 12px rgba(212, 118, 42, 0.15);
	}

	/* Section */
	.section {
		margin: 3.5rem 0;
		position: relative;
	}

	.section-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 1.5rem;
		letter-spacing: -0.01em;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: color 0.3s ease;
	}

	.section-title::before {
		content: '✦';
		color: var(--accent);
		font-size: 1.2rem;
		opacity: 0.8;
	}

	.section-title .accent {
		color: var(--accent);
	}

	.divider {
		border: none;
		border-top: 1px solid var(--border-color);
		margin: 2.5rem 0;
		position: relative;
		transition: border-color 0.3s ease;
	}

	.divider::after {
		content: '✦ ✦ ✦';
		position: absolute;
		top: -0.6rem;
		left: 50%;
		transform: translateX(-50%);
		background: var(--bg-primary);
		padding: 0 1rem;
		color: var(--accent);
		font-size: 0.6rem;
		letter-spacing: 0.5em;
		opacity: 0.3;
		transition: background 0.3s ease;
	}

	/* Projects Grid */
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.project {
		background: var(--card-bg);
		border: 1px solid var(--border-color);
		border-radius: 10px;
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		display: flex;
		flex-direction: column;
	}

	.project:hover {
		border-color: var(--accent);
		transform: translateY(-6px);
		box-shadow: 0 12px 32px var(--shadow-hover);
	}

	.project-image-wrapper {
		width: 100%;
		height: 200px;
		overflow: hidden;
		background: var(--bg-secondary);
		flex-shrink: 0;
	}

	.project-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.project:hover .project-image {
		transform: scale(1.05);
	}

	.project-content {
		padding: 1.25rem 1.5rem 1.5rem;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.project .tag {
		display: inline-block;
		font-size: 0.6rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--accent);
		background: var(--badge-bg);
		padding: 0.15rem 0.6rem;
		border-radius: 4px;
		margin-bottom: 0.5rem;
		align-self: flex-start;
		transition: background 0.3s ease;
	}

	.project h3 {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
		transition: color 0.3s ease;
	}

	.project .desc {
		font-size: 0.85rem;
		color: var(--text-muted);
		margin-bottom: 0.75rem;
		flex: 1;
		transition: color 0.3s ease;
	}

	.project .stack {
		font-size: 0.75rem;
		color: var(--text-muted);
		font-weight: 500;
		margin-bottom: 0.75rem;
		transition: color 0.3s ease;
	}

	.project .stack .highlight {
		color: var(--accent);
		font-weight: 600;
	}

	.project-links {
		display: flex;
		gap: 1.25rem;
		margin-top: 0.25rem;
	}

	.project-link {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--text-muted);
		text-decoration: none;
		transition: all 0.3s;
		position: relative;
	}

	.project-link:hover {
		color: var(--accent);
	}

	.project-link::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		right: 0;
		height: 1.5px;
		background: linear-gradient(90deg, var(--gradient-start), var(--gradient-end));
		transform: scaleX(0);
		transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.project-link:hover::after {
		transform: scaleX(1);
	}

	.project-link::before {
		content: '→ ';
		transition: transform 0.3s;
	}

	.project-link:hover::before {
		transform: translateX(4px);
	}

	/* If no image, add a subtle placeholder */
	.project:not(:has(.project-image-wrapper)) .project-content {
		padding-top: 1.5rem;
	}

	/* Timeline */
	.timeline {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.timeline-item {
		display: flex;
		gap: 2rem;
		padding: 0.5rem 0;
		align-items: baseline;
		border-left: 2px solid var(--border-color);
		padding-left: 1.5rem;
		transition: all 0.3s;
		position: relative;
	}

	.timeline-item:hover {
		border-left-color: var(--accent);
	}

	.timeline-item::before {
		content: '──';
		color: var(--accent);
		position: absolute;
		left: -0.8rem;
		opacity: 0;
		transition: opacity 0.3s;
	}

	.timeline-item:hover::before {
		opacity: 1;
	}

	.timeline-year {
		font-weight: 600;
		color: var(--accent);
		min-width: 70px;
		font-size: 0.9rem;
	}

	.timeline-content {
		color: var(--text-secondary);
		font-size: 0.95rem;
		transition: color 0.3s ease;
	}

	.timeline-content .company {
		color: var(--text-muted);
		font-weight: 400;
		transition: color 0.3s ease;
	}

	.timeline-content .company::before {
		content: '· ';
	}

	/* Contact */
	.contact-links {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
		margin-bottom: 2rem;
	}

	.contact-links a {
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.95rem;
		font-weight: 500;
		padding: 0.4rem 0;
		border-bottom: 2px solid transparent;
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		position: relative;
	}

	.contact-links a::before {
		content: '→ ';
		color: var(--accent);
		opacity: 0;
		transform: translateX(-8px);
		transition: all 0.3s;
	}

	.contact-links a:hover {
		color: var(--accent);
		border-bottom-color: var(--accent);
	}

	.contact-links a:hover::before {
		opacity: 1;
		transform: translateX(0);
	}

	.empty {
		color: var(--text-muted);
		font-size: 0.95rem;
	}

	/* Footer */
	.footer {
		margin-top: 3.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-color);
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.85rem;
		color: var(--text-muted);
		transition: border-color 0.3s ease, color 0.3s ease;
		position: relative;
	}

	.footer::before {
		content: '✦ ✦ ✦';
		position: absolute;
		top: -0.7rem;
		left: 50%;
		transform: translateX(-50%);
		background: var(--bg-primary);
		padding: 0 1rem;
		color: var(--accent);
		font-size: 0.5rem;
		letter-spacing: 0.5em;
		opacity: 0.2;
		transition: background 0.3s ease;
	}

	.footer a {
		color: var(--text-muted);
		text-decoration: none;
		transition: color 0.2s;
		position: relative;
	}

	.footer a:hover {
		color: var(--accent);
	}

	.footer .dot {
		color: var(--accent);
		margin: 0 0.5rem;
	}

	.footer .heart {
		color: var(--accent);
		animation: heartbeat 1.5s ease-in-out infinite;
		display: inline-block;
	}

	@keyframes heartbeat {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.2); }
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.container {
			padding: 1.5rem;
		}

		.header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}

		.nav {
			gap: 1.25rem;
		}

		.hero h1 {
			font-size: 2.2rem;
		}

		.hero h1 .highlight::after {
			display: none;
		}

		.grid {
			grid-template-columns: 1fr;
		}

		.timeline-item {
			flex-direction: column;
			gap: 0.1rem;
			padding-left: 1rem;
		}

		.contact-links {
			gap: 1.25rem;
		}

		.footer {
			flex-direction: column;
			gap: 0.5rem;
			text-align: center;
		}

		.hero::after {
			display: none;
		}

		.theme-toggle {
			top: 1rem;
			right: 1rem;
			width: 38px;
			height: 38px;
			font-size: 1rem;
		}
	}

	@media (max-width: 480px) {
		:global(body) {
			padding: 0.5rem;
		}

		.container {
			padding: 1rem;
			border-radius: 12px;
		}

		.hero h1 {
			font-size: 1.8rem;
		}

		.actions {
			flex-direction: column;
			width: 100%;
		}

		.btn {
			text-align: center;
			width: 100%;
			justify-content: center;
		}

		.theme-toggle {
			top: 0.75rem;
			right: 0.75rem;
			width: 34px;
			height: 34px;
			font-size: 0.9rem;
		}
	}

	/* Reduce motion preferences */
	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}
	}
</style>