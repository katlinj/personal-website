<script>
	import { onMount } from 'svelte';

	export let data;

	$: profile = data.profile ?? {};
	$: projects = data.projects ?? [];
	$: experience = data.experience ?? [];

	const sections = [
		{ id: 'about', label: 'About' },
		{ id: 'work', label: 'Work' },
		{ id: 'experience', label: 'Experience' },
		{ id: 'contact', label: 'Contact' }
	];

	let activeSection = 'about';

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) activeSection = entry.target.id;
				});
			},
			{ rootMargin: '-40% 0px -50% 0px' }
		);

		sections.forEach(({ id }) => {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		});

		return () => observer.disconnect();
	});

	function formatDate(d) {
		if (!d) return '';
		return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
	}

	function formatRange(start, end, isCurrent) {
		const from = formatDate(start);
		const to = isCurrent ? 'Present' : formatDate(end) || 'Present';
		return [from, to].filter(Boolean).join(' – ');
	}
</script>

<svelte:head>
	<title>{profile.name ? `${profile.name} — Portfolio` : 'Portfolio'}</title>
	{#if profile.bio}<meta name="description" content={profile.bio} />{/if}
</svelte:head>

<nav class="nav">
	<a href="#about" class="brand">{profile.name || 'Portfolio'}</a>
	<div class="nav-links">
		{#each sections as s}
			<a href="#{s.id}" class:active={activeSection === s.id}>{s.label}</a>
		{/each}
		<a href="/admin" class="admin-btn">Admin</a>
	</div>
</nav>

<main>
	<section id="about" class="hero">
		<p class="eyebrow">Welcome</p>
		<h1>{profile.name || 'Your Name'}</h1>
		<p class="role">{profile.role || 'Software Developer'}</p>
		{#if profile.bio}<p class="bio">{profile.bio}</p>{/if}

		<div class="cta-row">
			<a href="#work" class="btn">View my work</a>
			{#if profile.email}<a href="mailto:{profile.email}" class="btn btn-outline">Get in touch</a
				>{/if}
		</div>

		{#if profile.skills?.length}
			<ul class="skills">
				{#each profile.skills as skill}
					<li>{skill}</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section id="work">
		<p class="eyebrow">Work</p>
		<h2>Projects</h2>
		{#if projects.length}
			<div class="grid">
				{#each projects as p (p.id)}
					<article class="card">
						{#if p.featured}<span class="featured-tag">Featured</span>{/if}
						<h3>{p.title}</h3>
						{#if p.description}<p class="desc">{p.description}</p>{/if}
						{#if p.tech_stack?.length}
							<ul class="tags">
								{#each p.tech_stack as t}<li>{t}</li>{/each}
							</ul>
						{/if}
						<div class="card-links">
							{#if p.project_url}<a href={p.project_url} target="_blank" rel="noreferrer"
									>View live →</a
								>{/if}
							{#if p.github_url}<a href={p.github_url} target="_blank" rel="noreferrer"
									>Source →</a
								>{/if}
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<p class="empty">No projects yet — add some from <a href="/admin">/admin</a>.</p>
		{/if}
	</section>

	<section id="experience">
		<p class="eyebrow">Career</p>
		<h2>Experience</h2>
		{#if experience.length}
			<ul class="timeline">
				{#each experience as e (e.id)}
					<li>
						<div class="tl-date">{formatRange(e.start_date, e.end_date, e.is_current)}</div>
						<div class="tl-content">
							<h3>{e.role}</h3>
							<p class="company">{e.company}</p>
							{#if e.description}<p class="desc">{e.description}</p>{/if}
							{#if e.tech_stack?.length}
								<ul class="tags">
									{#each e.tech_stack as t}<li>{t}</li>{/each}
								</ul>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="empty">No experience listed yet — add some from <a href="/admin">/admin</a>.</p>
		{/if}
	</section>

	<footer id="contact">
		<p class="eyebrow">Contact</p>
		<h2>Let's work together</h2>
		{#if profile.bio}<p class="desc">Feel free to reach out — I'd love to hear from you.</p>{/if}
		<div class="cta-row">
			{#if profile.email}<a href="mailto:{profile.email}" class="btn">{profile.email}</a>{/if}
		</div>
		<div class="footer-links">
			{#if profile.github_url}<a href={profile.github_url} target="_blank" rel="noreferrer"
					>GitHub</a
				>{/if}
			{#if profile.linkedin_url}<a href={profile.linkedin_url} target="_blank" rel="noreferrer"
					>LinkedIn</a
				>{/if}
			{#if profile.resume_url}<a href={profile.resume_url} target="_blank" rel="noreferrer"
					>Resume</a
				>{/if}
		</div>
		{#if profile.location}<p class="location">{profile.location}</p>{/if}
	</footer>
</main>

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.1rem clamp(1.25rem, 4vw, 3rem);
		background: rgba(246, 247, 249, 0.85);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--border);
		flex-wrap: wrap;
	}

	.brand {
		font-family: var(--display);
		font-weight: 600;
		color: var(--text);
		font-size: 1.05rem;
	}

	.brand:hover {
		text-decoration: none;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 1.75rem;
		flex-wrap: wrap;
	}

	.nav-links a {
		color: var(--muted);
		font-size: 0.92rem;
		font-weight: 500;
	}

	.nav-links a:hover {
		color: var(--text);
		text-decoration: none;
	}

	.nav-links a.active {
		color: var(--accent);
	}

	.admin-btn {
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.35rem 0.9rem;
		color: var(--muted) !important;
	}

	.admin-btn:hover {
		border-color: var(--accent);
		color: var(--accent) !important;
	}

	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 clamp(1.25rem, 4vw, 3rem);
	}

	section,
	footer {
		padding: clamp(3.5rem, 7vw, 5.5rem) 0;
		border-bottom: 1px solid var(--border);
	}

	footer {
		border-bottom: none;
		text-align: left;
	}

	h1 {
		font-size: clamp(2.2rem, 5vw, 3.2rem);
		letter-spacing: -0.02em;
	}

	h2 {
		font-size: clamp(1.5rem, 3vw, 1.9rem);
		margin-bottom: 1.75rem;
	}

	.role {
		font-family: var(--display);
		font-size: 1.15rem;
		color: var(--accent);
		margin: 0.5rem 0 1.25rem;
	}

	.bio {
		font-size: 1.05rem;
		line-height: 1.75;
		color: var(--muted);
		max-width: 58ch;
		margin: 0 0 2rem;
	}

	.cta-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-bottom: 2rem;
	}

	.btn {
		background: var(--accent);
		color: #fff !important;
		padding: 0.7rem 1.4rem;
		border-radius: 999px;
		font-weight: 600;
		font-size: 0.95rem;
	}

	.btn:hover {
		text-decoration: none;
		opacity: 0.9;
	}

	.btn-outline {
		background: transparent;
		color: var(--text) !important;
		border: 1px solid var(--border);
	}

	.btn-outline:hover {
		border-color: var(--accent);
		color: var(--accent) !important;
	}

	.skills {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
		padding: 0;
		margin: 0;
	}

	.skills li {
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--accent);
		background: var(--accent-soft);
		padding: 0.35rem 0.8rem;
		border-radius: 999px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.25rem;
	}

	.card {
		position: relative;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 14px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		box-shadow: 0 1px 2px rgba(16, 24, 40, 0.03);
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}

	.card:hover {
		transform: translateY(-3px);
		box-shadow: 0 10px 24px rgba(16, 24, 40, 0.08);
	}

	.featured-tag {
		align-self: flex-start;
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--warm);
		background: #fdf1e6;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
	}

	.card h3 {
		font-size: 1.1rem;
	}

	.desc {
		color: var(--muted);
		line-height: 1.6;
		font-size: 0.96rem;
		margin: 0;
	}

	.tags {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		padding: 0;
		margin: 0.25rem 0 0;
	}

	.tags li {
		font-size: 0.78rem;
		color: var(--muted);
		background: var(--bg);
		border: 1px solid var(--border);
		padding: 0.2rem 0.55rem;
		border-radius: 6px;
	}

	.card-links {
		display: flex;
		gap: 1.25rem;
		font-size: 0.88rem;
		font-weight: 500;
		margin-top: 0.25rem;
	}

	.timeline {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 2.25rem;
	}

	.timeline li {
		display: grid;
		grid-template-columns: 140px 1fr;
		gap: 1.5rem;
	}

	.tl-date {
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--muted);
		padding-top: 0.2rem;
	}

	.tl-content h3 {
		font-size: 1.05rem;
	}

	.company {
		font-weight: 500;
		color: var(--accent);
		margin: 0.2rem 0 0.6rem;
	}

	.empty {
		color: var(--muted);
		font-size: 0.95rem;
	}

	.footer-links {
		display: flex;
		gap: 1.5rem;
		font-weight: 500;
		margin: 1.5rem 0 0.75rem;
	}

	.location {
		color: var(--muted);
		font-size: 0.9rem;
		margin: 0;
	}

	@media (max-width: 560px) {
		.timeline li {
			grid-template-columns: 1fr;
			gap: 0.4rem;
		}
	}
</style>