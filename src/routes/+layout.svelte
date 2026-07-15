<slot />

<style>
	:global(:root) {
		--bg: #0d0f14;
		--panel: #151822;
		--panel-border: #262b38;
		--text: #e7e9ee;
		--muted: #7a8299;
		--accent: #6c8eef;
		--accent-2: #e0a458;
		--mono: 'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace;
		--sans:
			'Inter',
			system-ui,
			-apple-system,
			sans-serif;
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
		font-family: var(--mono);
		font-weight: 600;
		margin: 0;
	}

	:global(a) {
		color: var(--accent);
		text-decoration: none;
	}

	:global(a:hover) {
		text-decoration: underline;
	}

	:global(button) {
		font-family: var(--mono);
		cursor: pointer;
	}

	:global(::selection) {
		background: var(--accent);
		color: var(--bg);
	}

	:global(:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	:global(.section-label) {
		font-family: var(--mono);
		color: var(--muted);
		font-size: 0.95rem;
		letter-spacing: 0.02em;
		margin: 0 0 1.5rem;
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
