<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import { toastState } from '$lib/states/toastState.svelte';
	import { loadYouTubeAPI, type YTPlayer } from '$lib/utils/youtubeLoader';
	import { onMount } from 'svelte';

	let { videoId = '' }: { videoId?: string } = $props();
	let container: HTMLDivElement;

	onMount(() => {
		let disposed = false;
		let player: YTPlayer | null = null;
		let interval: ReturnType<typeof setInterval> | undefined;
		const state = editorState.playerState;
		const sync = (target: YTPlayer) => {
			if (disposed || state.playerRef !== target) return;
			state.updateCurrentTime(target.getCurrentTime());
			state.setDuration(target.getDuration());
			state.isPlaying = target.getPlayerState() === window.YT.PlayerState.PLAYING;
		};
		const init = async () => {
			try {
				await loadYouTubeAPI();
				if (disposed || !videoId) return;
				player = new window.YT.Player(container, {
					videoId,
					height: '100%',
					width: '100%',
					playerVars: { autoplay: 0, controls: 1 },
					events: {
						onReady: ({ target }) => {
							if (disposed) return;
							state.playerRef = target;
							target.setVolume(state.volume);
							sync(target);
							interval = setInterval(() => sync(target), 100);
						},
						onStateChange: ({ target }) => sync(target),
						onError: () => {
							if (disposed) return;
							state.isPlaying = false;
							toastState.error('YouTube動画を再生できませんでした');
						}
					}
				});
			} catch (error) {
				if (!disposed)
					toastState.error(
						error instanceof Error ? error.message : 'YouTubeの初期化に失敗しました'
					);
			}
		};
		void init();
		return () => {
			disposed = true;
			clearInterval(interval);
			if (state.playerRef === player) {
				state.isPlaying = false;
				state.playerRef = null;
			}
			player?.destroy();
		};
	});
</script>

<div bind:this={container} class="h-full w-full"></div>
