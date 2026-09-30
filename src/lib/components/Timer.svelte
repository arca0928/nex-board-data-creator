<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import { usePreviewClock } from '$lib/utils/timing.svelte';

	const playerState = editorState.playerState;
	const clock = usePreviewClock();

	function formatClock(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
</script>

<div class="ml-auto flex items-center rounded-xl bg-gray-200 px-5 py-2 font-mono">
	<div class="mr-5 text-base text-gray-600">再生時間</div>
	<div class="text-xl">
		<!-- csvの開始時間に入力する値 (小数第1位まで) -->
		<span class="font-bold">{clock.time.toFixed(1)}秒</span>
		<span class="mx-2 text-gray-400">|</span>
		{formatClock(clock.time)}/{formatClock(playerState.duration)}
	</div>
</div>
