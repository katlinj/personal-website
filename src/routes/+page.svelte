<script>
	import { onMount } from 'svelte';

	export let data;

	$: profile = data.profile ?? {};
	$: projects = data.projects ?? [];
	$: experience = data.experience ?? [];

	let typedText = '';
	let showCursor = true;

	function buildTemplate(p) {
		return `/**\n * name   : ${p.name || 'Your Name'}\n * role   : ${p.role || 'Software Developer'}\n * status : available for opportunities\n */`;
	}

	onMount(() => {
		const template = buildTemplate(profile);
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (reduceMotion) {
			typedText = template;
			return;
		}

		let i = 0;
		const interval = setInterval(() => {
			i += 1;
			typedText = template.slice(0, i);
			if (i >= template.length) clearInterval(interval);
		}, 14);

		const blink = setInterval(() => (showCursor = !showCursor), 550);

		return () => {
			clearInterval(interval);
			clearInterval(blink);
		};
	});

	function slugify(str) {
		return (str || 'project')
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}

	function shortHash(id) {
		return (id || '0000000').replace(/-/g, '').slice(0, 7);
	}

	function formatDate(d) {
		if (!d) return '';
		const date = new Date(d);
		return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
	}

	function formatRange(start, end, isCurrent) {
		const from = formatDate(start);
		const to = isCurrent ? 'present' : formatDate(end) || 'present';
		return [from, to].filter(Boolean).join(' — ');
	}
</script>

<svelte:head>
	<title>{profile.name ? `${profile.name} — Portfolio` : 'Portfolio'}</title>
	{#if profile.bio}<meta name="description" content={profile.bio} />{/if}
</svelte:head>

<nav class="tabs">
	<span class="tab-brand">{profile.name || 'portfolio'}</span>
	<div class="tab-links">
		<a href="#about" class="tab">about.js</a>
		<a href="#projects" class="tab">projects.js</a>
		<a href="#experience" class="tab">experience.js</a>
		<a href="#contact" class="tab">contact.js</a>
	</div>
</nav>

<main>
	<section id="about" class="hero">
		<pre class="typed">{typedText}<span class="cursor" class:hidden={!showCursor}>▍</span></pre>
		{#if profile.bio}<p class="bio">{profile.bio}</p>{/if}
		{#if profile.skills?.length}
			<ul class="skills">
				{#each profile.skills as skill}
					<li>{skill}</li>
				{/each}
			</ul>
		{/if}
		<div class="hero-links">
			{#if profile.email}<a href="mailto:{profile.email}">{profile.email}</a>{/if}
			{#if profile.github_url}<a href={profile.github_url} target="_blank" rel="noreferrer">github ↗</a
				>{/if}
			{#if profile.linkedin_url}<a href={profile.linkedin_url} target="_blank" rel="noreferrer"
					>linkedin ↗</a
				>{/if}
			{#if profile.resume_url}<a href={profile.resume_url} target="_blank" rel="noreferrer"
					>resume ↗</a
				>{/if}
		</div>
		{#if profile.location}<p class="location">// based in {profile.location}</p>{/if}
	</section>

	<section id="projects">
		<h2 class="section-label">// projects</h2>
		{#if projects.length}
			<div class="grid">
				{#each projects as p (p.id)}
					<article class="card">
						<div class="card-head">
							<span class="dot" />
							<span class="filename">{slugify(p.title)}.tsx</span>
							{#if p.featured}<span class="badge">featured</span>{/if}
						</div>
						<h3>{p.title}</h3>
						{#if p.description}<p class="desc">{p.description}</p>{/if}
						{#if p.tech_stack?.length}
							<p class="import">import &lbrace; {p.tech_stack.join(', ')} &rbrace;</p>
						{/if}
						<div class="card-links">
							{#if p.project_url}<a href={p.project_url} target="_blank" rel="noreferrer"
									>live ↗</a
								>{/if}
							{#if p.github_url}<a href={p.github_url} target="_blank" rel="noreferrer"
									>source ↗</a
								>{/if}
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<p class="empty">// no projects yet — add some from <a href="/admin">/admin</a></p>
		{/if}
	</section>

	<section id="experience">
		<h2 class="section-label">// experience</h2>
		{#if experience.length}
			<ol class="log">
				{#each experience as e (e.id)}
					<li>
						<span class="hash">{shortHash(e.id)}</span>
						<div class="entry">
							<p class="commit-msg">{e.role} @ {e.company}</p>
							<p class="meta">{formatRange(e.start_date, e.end_date, e.is_current)}</p>
							{#if e.description}<p class="desc">+ {e.description}</p>{/if}
							{#if e.tech_stack?.length}
								<p class="import">import &lbrace; {e.tech_stack.join(', ')} &rbrace;</p>
							{/if}
						</div>
					</li>
				{/each}
			</ol>
		{:else}
			<p class="empty">// no experience listed yet — add some from <a href="/admin">/admin</a></p>
		{/if}
	</section>

	<footer id="contact">
		<h2 class="section-label">// contact</h2>
		{#if profile.email}<p><a href="mailto:{profile.email}">{profile.email}</a></p>{/if}
		<div class="footer-links">
			{#if profile.github_url}<a href={profile.github_url} target="_blank" rel="noreferrer"
					>github</a
				>{/if}
			{#if profile.linkedin_url}<a href={profile.linkedin_url} target="_blank" rel="noreferrer"
					>linkedin</a
				>{/if}
		</div>
		<p class="admin-link"><a href="/admin">$ admin</a></p>
	</footer>
</main>

<style>
	.tabs {
		position: sticky;
		top: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem clamp(1.25rem, 4vw, 3rem);
		background: rgba(13, 15, 20, 0.85);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--panel-border);
		flex-wrap: wrap;
	}

	.tab-brand {
		font-family: var(--mono);
		font-weight: 600;
		color: var(--text);
	}

	.tab-links {
		display: flex;
		gap: 1.25rem;
		flex-wrap: wrap;
	}

	.tab {
		font-family: var(--mono);
		font-size: 0.9rem;
		color: var(--muted);
		padding-bottom: 0.25rem;
		border-bottom: 2px solid transparent;
	}

	.tab:hover {
		color: var(--accent);
		text-decoration: none;
		border-bottom-color: var(--accent);
	}

	main {
		max-width: 860px;
		margin: 0 auto;
		padding: 0 clamp(1.25rem, 4vw, 3rem);
	}

	section,
	footer {
		padding: clamp(3rem, 6vw, 5rem) 0;
		border-bottom: 1px solid var(--panel-border);
	}

	footer {
		border-bottom: none;
	}

	.hero {
		padding-top: clamp(3.5rem, 8vw, 6rem);
	}

	.typed {
		font-family: var(--mono);
		font-size: clamp(0.95rem, 2vw, 1.15rem);
		line-height: 1.6;
		color: var(--accent-2);
		white-space: pre-wrap;
		margin: 0 0 1.75rem;
		min-height: 6.5em;
	}

	.cursor {
		color: var(--accent);
	}

	.cursor.hidden {
		opacity: 0;
	}

	.bio {
		font-size: 1.1rem;
		line-height: 1.7;
		color: var(--text);
		max-width: 60ch;
		margin: 0 0 1.5rem;
	}

	.skills {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0;
		margin: 0 0 1.75rem;
	}

	.skills li {
		font-family: var(--mono);
		font-size: 0.8rem;
		color: var(--accent);
		border: 1px solid var(--panel-border);
		background: var(--panel);
		padding: 0.3rem 0.65rem;
		border-radius: 4px;
	}

	.hero-links {
		display: flex;
		flex-wrap: wrap;
		gap: 1.25rem;
		font-family: var(--mono);
		font-size: 0.9rem;
	}

	.location {
		font-family: var(--mono);
		color: var(--muted);
		font-size: 0.85rem;
		margin-top: 1.5rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.25rem;
	}

	.card {
		background: var(--panel);
		border: 1px solid var(--panel-border);
		border-radius: 8px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		transition: transform 0.15s ease, border-color 0.15s ease;
	}

	.card:hover {
		transform: translateY(-2px);
		border-color: var(--accent);
	}

	.card-head {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--mono);
		font-size: 0.78rem;
		color: var(--muted);
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--accent-2);
		flex-shrink: 0;
	}

	.filename {
		flex: 1;
	}

	.badge {
		font-size: 0.68rem;
		color: var(--accent);
		border: 1px solid var(--accent);
		border-radius: 999px;
		padding: 0.1rem 0.5rem;
	}

	.card h3 {
		font-size: 1.05rem;
	}

	.desc {
		color: var(--text);
		line-height: 1.55;
		font-size: 0.95rem;
		margin: 0;
	}

	.import {
		font-family: var(--mono);
		font-size: 0.8rem;
		color: var(--muted);
		margin: 0;
	}

	.card-links {
		display: flex;
		gap: 1rem;
		font-family: var(--mono);
		font-size: 0.85rem;
		margin-top: 0.25rem;
	}

	.log {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	.log li {
		display: flex;
		gap: 1rem;
	}

	.hash {
		font-family: var(--mono);
		font-size: 0.8rem;
		color: var(--accent);
		flex-shrink: 0;
		padding-top: 0.15rem;
	}

	.entry {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.commit-msg {
		font-family: var(--mono);
		font-weight: 600;
		font-size: 1rem;
		margin: 0;
		color: var(--text);
	}

	.meta {
		font-family: var(--mono);
		font-size: 0.8rem;
		color: var(--muted);
		margin: 0;
	}

	.log .desc {
		color: var(--accent-2);
	}

	.empty {
		font-family: var(--mono);
		color: var(--muted);
		font-size: 0.9rem;
	}

	.footer-links {
		display: flex;
		gap: 1.25rem;
		font-family: var(--mono);
		font-size: 0.9rem;
		margin: 0.5rem 0 1.5rem;
	}

	.admin-link a {
		color: var(--muted);
		font-family: var(--mono);
		font-size: 0.8rem;
	}
</style>
