<!-- src/routes/+page.svelte -->
<script>
	import { onMount } from 'svelte';

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

		// Update active class on nav links
		const navLinks = document.querySelectorAll('.nav-link');
		navLinks.forEach(link => {
			link.classList.remove('active');
			if (link.getAttribute('href') === `#${activeSection}`) {
				link.classList.add('active');
			}
		});

		return () => observer.disconnect();
	});

	// Update active state when section changes
	$: {
		if (typeof document !== 'undefined') {
			const navLinks = document.querySelectorAll('.nav-link');
			navLinks.forEach(link => {
				link.classList.remove('active');
				if (link.getAttribute('href') === `#${activeSection}`) {
					link.classList.add('active');
				}
			});
		}
	}

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
	<title>{profile?.name ? `${profile.name} — Portfolio` : 'Portfolio'}</title>
	{#if profile?.bio}<meta name="description" content={profile.bio} />{/if}
</svelte:head>

<main>
	<section id="about" class="hero">
		<p class="eyebrow">// PERSONNEL</p>
		<h1>{profile?.name || 'Your Name'}</h1>
		<p class="role">{profile?.role || 'Software Developer'}</p>
		{#if profile?.bio}<p class="bio">{profile.bio}</p>{/if}

		<div class="cta-row">
			<a href="#work" class="btn">[ OPEN DOSSIER ]</a>
			{#if profile?.email}<a href="mailto:{profile.email}" class="btn btn-outline">[ SEND MESSAGE ]</a>{/if}
		</div>

		{#if profile?.skills?.length}
			<ul class="skills">
				{#each profile.skills as skill}
					<li>{skill}</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section id="work">
		<p class="eyebrow">02 // MISSION ARCHIVE</p>
		<h2>Projects</h2>
		{#if projects.length}
			<div class="grid">
				{#each projects as p (p.id)}
					<article class="card">
						{#if p.featured}<span class="featured-tag">▮ PRIORITY</span>{/if}
						<h3>MISSION_{String(p.id).padStart(3, '0')}</h3>
						<p class="mission-title">{p.title}</p>
						{#if p.description}<p class="desc">{p.description}</p>{/if}
						{#if p.tech_stack?.length}
							<ul class="tags">
								{#each p.tech_stack as t}<li>{t}</li>{/each}
							</ul>
						{/if}
						<div class="card-links">
							{#if p.project_url}<a href={p.project_url} target="_blank" rel="noreferrer">▸ View live</a>{/if}
							{#if p.github_url}<a href={p.github_url} target="_blank" rel="noreferrer">▸ Source</a>{/if}
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<p class="empty">No missions recorded — add some from <a href="/admin">/admin</a>.</p>
		{/if}
	</section>

	<section id="experience">
		<p class="eyebrow">03 // OPERATION HISTORY</p>
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
			<p class="empty">No operations logged — add some from <a href="/admin">/admin</a>.</p>
		{/if}
	</section>

	<footer id="contact">
		<p class="eyebrow">05 // SYSTEM LINKS</p>
		<h2>Contact</h2>
		{#if profile?.bio}<p class="desc">Establish secure channel — transmissions are encrypted.</p>{/if}
		<div class="cta-row">
			{#if profile?.email}<a href="mailto:{profile.email}" class="btn">{profile.email}</a>{/if}
		</div>
		<div class="footer-links">
			{#if profile?.github_url}<a href={profile.github_url} target="_blank" rel="noreferrer">□ GitHub</a>{/if}
			{#if profile?.linkedin_url}<a href={profile.linkedin_url} target="_blank" rel="noreferrer">□ LinkedIn</a>{/if}
			{#if profile?.resume_url}<a href={profile.resume_url} target="_blank" rel="noreferrer">□ Resume</a>{/if}
		</div>
		{#if profile?.location}<p class="location">{profile.location}</p>{/if}
		<p class="end-of-record">END OF RECORD</p>
	</footer>
</main>

<style>
	main {
		max-width: 820px;
		margin: 0 auto;
	}

	section,
	footer {
		padding: clamp(3.5rem, 7vw, 5.5rem) 0;
		border-bottom: 1px solid #4d3a2a;
	}

	footer {
		border-bottom: none;
	}

	h1 {
		font-size: clamp(2.4rem, 5vw, 3.4rem);
		letter-spacing: -0.02em;
		color: #f5d6b0;
		text-shadow: 0 0 10px #b87a3e33;
	}

	h2 {
		font-size: clamp(1.6rem, 3vw, 2rem);
		margin-bottom: 1.75rem;
		color: #f5d6b0;
		letter-spacing: 0.02em;
	}

	.role {
		font-size: 1.1rem;
		color: #e68a2e;
		margin: 0.4rem 0 1.2rem;
		letter-spacing: 0.12em;
	}

	.bio {
		font-size: 1rem;
		line-height: 1.75;
		color: #c7a078;
		max-width: 58ch;
		margin: 0 0 2rem;
		border-left: 3px solid #e68a2e;
		padding-left: 1rem;
		background: rgba(18, 22, 28, 0.5);
		border-radius: 0 4px 4px 0;
		padding: 0.5rem 1rem;
	}

	.cta-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.9rem;
		margin-bottom: 2rem;
	}

	.btn {
		background: #e68a2e;
		color: #0b0d0f !important;
		padding: 0.6rem 1.5rem;
		border-radius: 999px;
		font-weight: 600;
		font-size: 0.85rem;
		letter-spacing: 0.04em;
		border: 1px solid #e68a2e;
		transition: all 0.15s;
	}
	.btn:hover {
		opacity: 0.9;
		text-decoration: none;
		box-shadow: 0 0 16px #e68a2e66;
	}

	.btn-outline {
		background: transparent;
		color: #f5d6b0 !important;
		border: 1px solid #4d3a2a;
	}
	.btn-outline:hover {
		border-color: #e68a2e;
		color: #e68a2e !important;
		box-shadow: none;
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
		font-size: 0.78rem;
		font-weight: 500;
		color: #e68a2e;
		background: #2a1f15;
		border: 1px solid #4d3a2a;
		padding: 0.3rem 0.8rem;
		border-radius: 999px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.card {
		background: #0f1319;
		border: 1px solid #4d3a2a;
		border-radius: 10px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
		transition: transform 0.15s ease, box-shadow 0.15s ease;
	}
	.card:hover {
		transform: translateY(-3px);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.7), 0 0 0 1px #e68a2e;
	}

	.featured-tag {
		align-self: flex-start;
		font-size: 0.65rem;
		font-weight: 600;
		color: #e68a2e;
		background: #1f160e;
		border: 1px solid #e68a2e;
		padding: 0.15rem 0.6rem;
		border-radius: 4px;
		letter-spacing: 0.06em;
	}

	.card h3 {
		font-size: 0.9rem;
		color: #e68a2e;
		letter-spacing: 0.04em;
	}
	.mission-title {
		font-weight: 600;
		font-size: 1.05rem;
		color: #f5d6b0;
		margin-top: -0.2rem;
	}
	.desc {
		color: #c7a078;
		line-height: 1.6;
		font-size: 0.9rem;
		margin: 0;
	}

	.tags {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		padding: 0;
		margin: 0.3rem 0 0;
	}
	.tags li {
		font-size: 0.7rem;
		color: #c7a078;
		background: #0b0d0f;
		border: 1px solid #4d3a2a;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
	}

	.card-links {
		display: flex;
		gap: 1.25rem;
		font-size: 0.8rem;
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
		border-left: 2px solid #4d3a2a;
		padding-left: 1.5rem;
	}
	.tl-date {
		font-size: 0.8rem;
		font-weight: 500;
		color: #e68a2e;
		padding-top: 0.2rem;
	}
	.tl-content h3 {
		font-size: 1rem;
		color: #f5d6b0;
	}
	.company {
		font-weight: 500;
		color: #e68a2e;
		margin: 0.2rem 0 0.6rem;
	}

	.empty {
		color: #c7a078;
		font-size: 0.95rem;
	}
	.empty a {
		color: #e68a2e;
	}

	.footer-links {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		font-weight: 500;
		margin: 1.5rem 0 0.75rem;
	}
	.footer-links a {
		color: #f5d6b0;
		font-size: 0.85rem;
		letter-spacing: 0.04em;
	}
	.footer-links a:hover {
		color: #e68a2e;
	}

	.location {
		color: #c7a078;
		font-size: 0.85rem;
		margin: 0;
	}

	.end-of-record {
		text-align: right;
		font-size: 0.65rem;
		color: #c7a078;
		letter-spacing: 0.2em;
		margin-top: 2rem;
		border-top: 1px solid #4d3a2a;
		padding-top: 1.2rem;
		opacity: 0.6;
	}

	@media (max-width: 600px) {
		.timeline li {
			grid-template-columns: 1fr;
			gap: 0.3rem;
			border-left: none;
			padding-left: 0;
		}
	}
</style>