<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';

	const focusedRow = $derived(
		editorState.focusedIndex !== null ? editorState.rows[editorState.focusedIndex] : null
	);
	const focusedLabel = $derived(
		editorState.focusedIndex !== null ? `${editorState.focusedIndex + 1}行目` : ''
	);

	// 選択中の行の開始時間に現在の再生位置を入力する (小数第1位まで)
	function setStartToCurrentTime() {
		if (!focusedRow) return;
		focusedRow.start = Math.round(editorState.playerState.getExactTime() * 10) / 10;
	}

	function handleDelete() {
		if (!focusedRow) return;
		// 内容が入力済みの行は誤削除防止のため確認する
		if ((focusedRow.content || focusedRow.lyric) && !confirm(`${focusedLabel}を削除しますか?`)) {
			return;
		}
		editorState.deleteRow();
	}
</script>

<div class="flex w-auto items-center gap-3 border-b border-gray-300 bg-gray-100 px-4 py-3">
	<button onclick={() => editorState.addRow()} type="button" class="btn btn-secondary">
		{focusedLabel ? `${focusedLabel}の下に行を追加` : '行を追加'}
	</button>
	<button
		onclick={setStartToCurrentTime}
		type="button"
		disabled={!focusedRow}
		class="btn btn-secondary"
		title="選択中の行の開始時間に、現在の再生時間を入力します"
	>
		開始時間に現在の再生時間を入力
	</button>
	<button onclick={handleDelete} type="button" disabled={!focusedRow} class="btn btn-danger">
		{focusedLabel ? `${focusedLabel}を削除` : '行を削除'}
	</button>
	<p class="text-sm whitespace-nowrap text-gray-600">
		セルをクリックして行を選択 / 表は左右にスクロールできます
	</p>
</div>
