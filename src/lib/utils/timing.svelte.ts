import { editorState } from '$lib/states/editorState.svelte';

export function usePreviewClock() {
	// 関数内に状態を持たせることで、呼び出したコンポーネントのライフサイクルと連動します
	let animatedTime = $state(0);

	$effect(() => {
		const isPlaying = editorState.playerState.isPlaying;
		const pTime = editorState.playerState.currentTime;
		const playerRef = editorState.playerState.playerRef;

		if (!isPlaying || !playerRef) {
			animatedTime = playerRef ? editorState.playerState.getExactTime() : pTime;
			return;
		}

		let animationFrameId: number;

		function syncWithPlayerFrame() {
			if (!playerRef) return;

			let exactTime = animatedTime;

			if ('currentTime' in playerRef) {
				exactTime = playerRef.currentTime;
			} else if ('getCurrentTime' in playerRef && typeof playerRef.getCurrentTime === 'function') {
				exactTime = playerRef.getCurrentTime();
			}

			animatedTime = exactTime;
			animationFrameId = requestAnimationFrame(syncWithPlayerFrame);
		}

		animationFrameId = requestAnimationFrame(syncWithPlayerFrame);

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	});

	// 最新の時間をゲッターとして返す
	return {
		get time() {
			return animatedTime;
		}
	};
}
