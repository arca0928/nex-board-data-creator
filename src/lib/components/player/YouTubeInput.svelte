<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import { toastState } from '$lib/states/toastState.svelte';

	let youtubeUrl = $state('');

	function handleSubmit() {
		// URL から Video ID を抽出
		const videoId = extractYouTubeVideoId(youtubeUrl);

		if (!videoId) {
			toastState.error('有効な YouTube URL を入力してください');
			return;
		}

		editorState.playerState.setMediaSource({
			type: 'youtube',
			youtubeId: videoId
		});
	}

	/**
	 * YouTube URL から Video ID を抽出
	 * 対応形式:
	 * - https://www.youtube.com/watch?v=VIDEO_ID
	 * - https://youtu.be/VIDEO_ID
	 * - VIDEO_ID のみ
	 */
	function extractYouTubeVideoId(input: string): string | null {
		// Video ID のみ
		if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
			return input;
		}

		// youtube.com/watch?v=VIDEO_ID
		const match1 = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
		if (match1) return match1[1];

		// youtu.be/VIDEO_ID
		const match2 = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
		if (match2) return match2[1];

		return null;
	}
</script>

<form
	class="flex flex-col gap-2"
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
>
	<input
		type="text"
		placeholder="YouTube URL または Video ID を入力"
		aria-label="YouTube URL または Video ID"
		bind:value={youtubeUrl}
		class="rounded border border-gray-300 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-accent"
	/>
	<button type="submit" class="btn bg-red-600 py-2 font-bold text-white hover:bg-red-700">
		YouTube を読み込む
	</button>
</form>
