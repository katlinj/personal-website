<!-- src/routes/+layout.svelte -->
<script>
	// You can add any layout-level scripts here if needed
</script>

<div class="terminal-wrapper">
	<div class="terminal">
		<!-- Terminal Header with Navigation -->
		<div class="terminal-header">
			<span class="title">TERMINAL v2.4</span>
			<nav class="nav-links">
				<a href="#about" class="nav-link">About</a>
				<a href="#work" class="nav-link">Work</a>
				<a href="#experience" class="nav-link">Experience</a>
				<a href="#contact" class="nav-link">Contact</a>
				<a href="/admin" class="admin-btn">Admin</a>
			</nav>
		</div>

		<!-- Main Content - THIS IS WHERE YOUR PAGE CONTENT GOES -->
		<div class="terminal-body">
			<slot />
		</div>

		<!-- Terminal Footer Line -->
		<div class="terminal-footer"></div>
	</div>
</div>

<style>
	:global(:root) {
		/* Terminal theme - Arknights inspired */
		--bg: #0b0d0f;
		--surface: #0f1319;
		--border: #4d3a2a;
		--text: #f5d6b0;
		--muted: #c7a078;
		--accent: #e68a2e;
		--accent-soft: #2a1f15;
		--warm: #e68a2e;
		--display: 'IBM Plex Mono', 'Courier New', monospace;
		--sans: 'IBM Plex Mono', 'Courier New', monospace;
	}

	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(html) {
		background: #0b0d0f;
		scroll-behavior: smooth;
	}

	:global(body) {
		margin: 0;
		padding: 2rem 1rem;
		background: #0b0d0f;
		color: #f5d6b0;
		font-family: 'IBM Plex Mono', 'Courier New', monospace;
		-webkit-font-smoothing: antialiased;
		line-height: 1.6;
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}

	:global(h1, h2, h3) {
		font-family: 'IBM Plex Mono', 'Courier New', monospace;
		font-weight: 600;
		margin: 0;
		color: #f5d6b0;
	}

	:global(a) {
		color: #e68a2e;
		text-decoration: none;
		transition: color 0.15s ease;
	}

	:global(a:hover) {
		color: #f5b86e;
		text-decoration: underline;
	}

	:global(button) {
		font-family: 'IBM Plex Mono', 'Courier New', monospace;
		cursor: pointer;
	}

	:global(::selection) {
		background: #e68a2e;
		color: #0b0d0f;
	}

	:global(:focus-visible) {
		outline: 2px solid #e68a2e;
		outline-offset: 2px;
	}

	/* Terminal Wrapper */
	.terminal-wrapper {
		width: 100%;
		max-width: 1100px;
		margin: 0 auto;
	}

	.terminal {
		background: #13171c;
		border: 1px solid #3d3228;
		border-radius: 12px;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), 0 0 0 1px #4d3a2a inset;
		overflow: hidden;
		padding: 1.2rem 1.5rem 1.8rem;
	}

	/* Terminal Header with Navigation */
	.terminal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #4d3a2a;
		padding-bottom: 0.6rem;
		margin-bottom: 1.2rem;
		font-size: 0.9rem;
		letter-spacing: 0.02em;
		color: #c9ad8a;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.terminal-header .title {
		font-weight: 600;
		color: #f5d6b0;
		letter-spacing: 0.05em;
		font-size: 0.9rem;
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.nav-link {
		color: #c7a078;
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		transition: color 0.15s ease;
	}

	.nav-link:hover {
		color: #f5d6b0;
		text-decoration: none;
	}

	.nav-link.active {
		color: #e68a2e;
		text-shadow: 0 0 8px #e68a2e44;
	}

	.admin-btn {
		border: 1px solid #4d3a2a;
		border-radius: 999px;
		padding: 0.25rem 0.8rem;
		color: #c7a078 !important;
		font-size: 0.7rem !important;
		letter-spacing: 0.06em;
		transition: all 0.15s ease;
	}

	.admin-btn:hover {
		border-color: #e68a2e;
		color: #e68a2e !important;
		text-decoration: none;
	}

	/* Terminal Body */
	.terminal-body {
		min-height: 200px;
	}

	/* Terminal Footer */
	.terminal-footer {
		border-top: 1px solid #2b343f;
		margin-top: 1.5rem;
		padding-top: 0.8rem;
		display: flex;
		justify-content: flex-end;
	}

	.terminal-footer::after {
		content: '◆ TERMINAL v2.4';
		font-size: 0.6rem;
		color: #4f6783;
		letter-spacing: 0.15em;
		opacity: 0.5;
	}

	/* Global Eyebrow */
	:global(.eyebrow) {
		font-family: 'IBM Plex Mono', 'Courier New', monospace;
		font-weight: 600;
		font-size: 0.7rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: #e68a2e;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0 0 0.75rem;
		opacity: 0.8;
	}

	:global(.eyebrow::before) {
		content: '';
		width: 18px;
		height: 3px;
		border-radius: 2px;
		background: #e68a2e;
		display: inline-block;
	}

	/* Scrollbar styling */
	:global(::-webkit-scrollbar) {
		width: 8px;
		height: 8px;
	}

	:global(::-webkit-scrollbar-track) {
		background: #0b0d0f;
		border-left: 1px solid #4d3a2a;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: #4d3a2a;
		border-radius: 4px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: #e68a2e;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(*) {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
			scroll-behavior: auto !important;
		}
	}

	/* Responsive */
	@media (max-width: 700px) {
		:global(body) {
			padding: 1rem 0.5rem;
		}
		.terminal {
			padding: 1rem;
		}
		.terminal-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}
		.nav-links {
			gap: 1rem;
			width: 100%;
			flex-wrap: wrap;
		}
		.nav-link {
			font-size: 0.7rem;
		}
	}
</style>