<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import { hasInvalidFileNamePart } from '$lib/utils/fileNameparser';

	const fileName = $derived(editorState.groupName + '__' + editorState.songName + '.csv');

	// 許可されていない文字が含まれているか判定する（含まれていれば true）
	const isGroupInvalid = $derived(hasInvalidFileNamePart(editorState.groupName));
	const isSongInvalid = $derived(hasInvalidFileNamePart(editorState.songName, true));

	const fieldClass = (invalid: boolean) =>
		`flex w-80 items-center rounded-xl px-3 py-2 text-lg focus-within:ring-2 ${invalid ? 'bg-red-100 outline-2 outline-red-500 focus-within:ring-red-400' : 'bg-gray-200 focus-within:ring-accent'}`;
</script>

<div class="flex items-start gap-4">
	<div class="flex flex-col">
		<label class={fieldClass(isGroupInvalid)}>
			<span class="shrink-0">グループ名:</span>
			<input
				class="ml-1 w-full rounded bg-transparent pl-1 text-base outline-none"
				placeholder="半角英数字と一部の半角記号のみ"
				aria-invalid={isGroupInvalid}
				bind:value={editorState.groupName}
			/>
		</label>
		{#if isGroupInvalid}
			<span class="mt-1 pl-2 text-sm font-bold text-red-500"
				>※使用できない文字、連続したアンダーバー、または曲名先頭のアンダーバーを修正してください</span
			>
		{/if}
	</div>
	<div class="flex flex-col">
		<label class={fieldClass(isSongInvalid)}>
			<span class="shrink-0">曲名:</span>
			<input
				class="ml-1 w-full rounded bg-transparent pl-1 text-base outline-none"
				placeholder="半角英数字と一部の半角記号のみ"
				aria-invalid={isSongInvalid}
				bind:value={editorState.songName}
			/>
		</label>
		{#if isSongInvalid}
			<span class="mt-1 pl-2 text-sm font-bold text-red-500"
				>※使用できない文字、連続したアンダーバー、または曲名先頭のアンダーバーを修正してください</span
			>
		{/if}
	</div>
	<div class="flex max-w-100 items-center rounded-xl bg-gray-200 px-3 text-lg">
		<span class="shrink-0">ファイル名:</span>
		<span class="ml-2 overflow-auto py-2.5 text-base whitespace-nowrap">
			{editorState.groupName == '' || editorState.songName == ''
				? '(csvファイル名を表示)'
				: fileName}
		</span>
	</div>
</div>
