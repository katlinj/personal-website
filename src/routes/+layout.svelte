<script>
	import { onMount } from 'svelte';

	onMount(() => {
		// Apply theme on initial load
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
	/* CSS Variables - Global */
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

	/* Global Reset */
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

	/* Scrollbar styling */
	:global(::-webkit-scrollbar) {
		width: 8px;
		height: 8px;
	}

	:global(::-webkit-scrollbar-track) {
		background: var(--bg-secondary);
	}

	:global(::-webkit-scrollbar-thumb) {
		background: var(--border-color);
		border-radius: 4px;
		transition: background 0.3s ease;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: var(--accent);
	}

	/* Firefox scrollbar */
	:global(*) {
		scrollbar-width: thin;
		scrollbar-color: var(--border-color) var(--bg-secondary);
	}

	/* Reduce motion preferences */
	@media (prefers-reduced-motion: reduce) {
		:global(*),
		:global(*::before),
		:global(*::after) {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}
	}

	/* Responsive body padding */
	@media (max-width: 480px) {
		:global(body) {
			padding: 0.5rem;
		}
	}
</style>