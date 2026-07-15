<slot />

<style>
	:global(:root) {
		--bg: #f6f7f9;
		--surface: #ffffff;
		--border: #e4e7ec;
		--text: #1b1e27;
		--muted: #667085;
		--accent: #4f46e5;
		--accent-soft: #eef0ff;
		--warm: #f2994a;
		--display: 'Space Grotesk', system-ui, sans-serif;
		--sans: 'Inter', system-ui, -apple-system, sans-serif;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(html) {
		background: var(--bg);
	}

	:global(body) {
		margin: 0;
		padding: 0;
		background: var(--bg);
		color: var(--text);
		font-family: var(--sans);
		-webkit-font-smoothing: antialiased;
	}

	:global(h1, h2, h3) {
		font-family: var(--display);
		font-weight: 600;
		margin: 0;
	}

	:global(a) {
		color: var(--accent);
		text-decoration: none;
	}

	:global(button) {
		font-family: var(--sans);
		cursor: pointer;
	}

	:global(::selection) {
		background: var(--accent);
		color: #fff;
	}

	:global(:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	:global(.eyebrow) {
		font-family: var(--sans);
		font-weight: 600;
		font-size: 0.8rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--accent);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0 0 0.75rem;
	}

	:global(.eyebrow::before) {
		content: '';
		width: 18px;
		height: 3px;
		border-radius: 2px;
		background: var(--accent);
		display: inline-block;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(*) {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
			scroll-behavior: auto !important;
		}
	}
</style>