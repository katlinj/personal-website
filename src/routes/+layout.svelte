<script>
	import { onMount } from 'svelte';

	onMount(() => {
		try {
			const savedTheme = localStorage.getItem('theme');
			if (savedTheme === 'dark' || savedTheme === 'light') {
				document.documentElement.setAttribute('data-theme', savedTheme);
			}
		} catch (error) {
			console.error('Failed to load theme preference:', error);
		}
	});
</script>

<slot />

<style>
	:global(:root) {
		--bg: #ffffff;
		--bg-raised: #fafafa;
		--ink: #111111;
		--ink-soft: #4a4a4a;
		--ink-faint: #8a8a8a;
		--line: #e6e6e4;
		--line-strong: #d4d4d2;
		--accent: #b45309;
		--accent-soft: #fdf3e7;
		--mark: #fff1a8;
		--focus: #111111;
		--modal-bg: #ffffff;

		/* Legacy aliases (used by /admin) mapped onto the new palette */
		--bg-primary: var(--bg);
		--bg-secondary: var(--bg-raised);
		--bg-tertiary: var(--bg-raised);
		--bg-hover: var(--accent-soft);
		--text-primary: var(--ink);
		--text-secondary: var(--ink-soft);
		--text-muted: var(--ink-faint);
		--border-color: var(--line);
		--border-hover: var(--line-strong);
		--accent-light: var(--accent-soft);
		--badge-bg: var(--accent-soft);
		--card-bg: var(--bg-raised);
		--gradient-start: var(--accent);
		--gradient-end: var(--accent);
		--shadow: rgba(17, 17, 17, 0.06);
		--shadow-hover: rgba(180, 83, 9, 0.12);
	}

	:global([data-theme='dark']) {
		--bg: #0a0a0a;
		--bg-raised: #131313;
		--ink: #f2f1ee;
		--ink-soft: #b9b7b1;
		--ink-faint: #77756f;
		--line: #232321;
		--line-strong: #33322f;
		--accent: #e0975a;
		--accent-soft: #201812;
		--mark: #3a3212;
		--focus: #f2f1ee;
		--modal-bg: #1c1c1a;

		/* Legacy aliases (used by /admin) mapped onto the new palette */
		--bg-primary: var(--bg);
		--bg-secondary: var(--bg-raised);
		--bg-tertiary: var(--bg-raised);
		--bg-hover: var(--accent-soft);
		--text-primary: var(--ink);
		--text-secondary: var(--ink-soft);
		--text-muted: var(--ink-faint);
		--border-color: var(--line);
		--border-hover: var(--line-strong);
		--accent-light: var(--accent-soft);
		--badge-bg: var(--accent-soft);
		--card-bg: var(--bg-raised);
		--gradient-start: var(--accent);
		--gradient-end: var(--accent);
		--shadow: rgba(0, 0, 0, 0.35);
		--shadow-hover: rgba(224, 151, 90, 0.18);
	}

	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		margin: 0;
		background: var(--bg);
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
		color: var(--ink);
		line-height: 1.6;
		transition: background 0.25s ease, color 0.25s ease;
		min-height: 100vh;
		-webkit-font-smoothing: antialiased;
	}

	:global(a) {
		color: inherit;
		text-decoration: none;
	}

	:global(::selection) {
		background: var(--mark);
		color: #111111;
	}

	:global(:focus-visible) {
		outline: 2px solid var(--focus);
		outline-offset: 3px;
	}

	:global(::-webkit-scrollbar) {
		width: 10px;
		height: 10px;
	}

	:global(::-webkit-scrollbar-track) {
		background: var(--bg);
	}

	:global(::-webkit-scrollbar-thumb) {
		background: var(--line-strong);
		border-radius: 0;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: var(--ink-faint);
	}

	:global(*) {
		scrollbar-width: thin;
		scrollbar-color: var(--line-strong) var(--bg);
	}

	@media (prefers-reduced-motion: reduce) {
		:global(*),
		:global(*::before),
		:global(*::after) {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}
	}
</style>