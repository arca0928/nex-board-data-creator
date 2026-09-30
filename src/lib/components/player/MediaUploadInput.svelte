<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import { toastState } from '$lib/states/toastState.svelte';
	import { MediaUploader } from '$lib/utils/mediaUploader';

	let fileInput: HTMLInputElement;

	async function handleFileSelect(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!file) return;
		if (!MediaUploader.isValidMediaFile(file)) {
			toastState.error('対応していないファイル形式です');
			return;
		}
		const fileUrl = MediaUploader.createBlobUrl(file);

		// state に保存
		editorState.playerState.setMediaSource({
			type: 'file',
			fileUrl: fileUrl,
			fileName: file.name,
			mimeType: file.type
		});
	}
</script>

<div class="flex flex-col gap-2">
	<button type="button" class="btn btn-secondary py-2" onclick={() => fileInput.click()}>
		動画・音声ファイルを選択
	</button>
	<input
		bind:this={fileInput}
		type="file"
		accept="video/*,audio/*"
		onchange={handleFileSelect}
		hidden
	/>

	{#if editorState.playerState.mediaSource?.fileName}
		<p class="text-sm text-gray-600">
			📄 {editorState.playerState.mediaSource.fileName}
		</p>
	{/if}
</div>
