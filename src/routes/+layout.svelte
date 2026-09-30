<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /><title>DataCreator for Nex-Board</title></svelte:head
>

<main class="flex min-h-screen flex-col">
	{@render children()}
</main>
