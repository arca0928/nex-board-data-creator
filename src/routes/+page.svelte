<script lang="ts">
	import CSVEditor from '$lib/components/CSVEditor.svelte';
	import Header from '$lib/components/Header.svelte';
	import Player from '$lib/components/Player.svelte';
	import Preview from '$lib/components/Preview.svelte';
	import Property from '$lib/components/Property.svelte';
	import Stage from '$lib/components/Stage.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { fileState } from '$lib/states/fileState.svelte';

	// ダウンロードしていない変更がある場合はページを離れる前に警告する
	function handleBeforeUnload(e: BeforeUnloadEvent) {
		if (fileState.hasUnsavedChanges()) {
			e.preventDefault();
		}
	}
</script>

<svelte:window onbeforeunload={handleBeforeUnload} />

<Header />
<div class="flex items-start gap-4 px-6 py-3">
	<Property />
	<Timer />
</div>

<!-- プレビューは画面幅基準で縮尺を計算するため、余白付きコンテナの外に置く -->
<Preview />

<div class="flex items-start gap-4 px-6 pb-3">
	<div class="flex w-80 shrink-0 flex-col gap-3">
		<Stage />
		<Player />
	</div>
	<CSVEditor />
</div>
<Footer />
<Toast />
