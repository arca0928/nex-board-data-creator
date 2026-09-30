<script lang="ts">
	import { editorState, type MediaSource } from '$lib/states/editorState.svelte';
	import { toastState } from '$lib/states/toastState.svelte';
	import { onMount } from 'svelte';

	let { source }: { source: MediaSource } = $props();
	let mediaElement: HTMLVideoElement | HTMLAudioElement | null = $state(null);

	onMount(() => {
		const element = mediaElement;
		if (!element) return;
		const state = editorState.playerState;
		state.playerRef = element;
		element.volume = state.volume / 100;
		const sync = () => {
			if (state.playerRef !== element) return;
			state.updateCurrentTime(element.currentTime);
			state.setDuration(Number.isFinite(element.duration) ? element.duration : 0);
			state.isPlaying = !element.paused && !element.ended;
		};
		const onError = () => {
			if (state.playerRef !== element) return;
			state.isPlaying = false;
			toastState.error('メディアを読み込めませんでした');
		};
		const events = [
			'loadedmetadata',
			'durationchange',
			'timeupdate',
			'seeked',
			'play',
			'pause',
			'ended'
		];
		for (const event of events) element.addEventListener(event, sync);
		element.addEventListener('error', onError);
		sync();
		return () => {
			for (const event of events) element.removeEventListener(event, sync);
			element.removeEventListener('error', onError);
			element.pause();
			if (state.playerRef === element) {
				state.updateCurrentTime(element.currentTime);
				state.isPlaying = false;
				state.playerRef = null;
			}
		};
	});
</script>

{#if source.mimeType?.startsWith('video')}
	<video
		bind:this={mediaElement}
		src={source.fileUrl}
		class="aspect-video w-full bg-black"
		controls
	>
		<track kind="captions" />
	</video>
{:else}
	<audio bind:this={mediaElement} src={source.fileUrl} class="w-full p-2" controls></audio>
{/if}
