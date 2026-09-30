<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import Toolbar from './editor/Toolbar.svelte';

	const placeHolder = {
		start: '秒',
		lyric: '歌詞',
		duration: '秒',
		content: '内容'
	};
	const options = {
		monitor: {
			default: 'モニターを選択',
			sub: 'サブモニター',
			main: 'メインモニター'
		},
		type: {
			default: '表示形式を選択',
			slide: 'スライド表示',
			loop: 'ループ表示',
			static: '固定表示'
		},
		left: {
			default: '',
			on: '点灯',
			off: '消灯'
		},
		right: {
			default: '',
			on: '点灯',
			off: '消灯'
		}
	};

	const columnLabels: Record<(typeof editorState.columns)[number], string> = {
		nexState: '電光掲示板の表示',
		start: '開始時間',
		lyric: '目安の歌詞',
		duration: '表示時間',
		monitor: 'モニター',
		type: '表示形式',
		color: '文字色',
		content: '内容',
		left: '左サイド',
		backOne: 'バック1',
		backTwo: 'バック2',
		backThree: 'バック3',
		backFour: 'バック4',
		backFive: 'バック5',
		backSix: 'バック6',
		right: '右サイド'
	};

	// 横スクロールしても行番号・表示・開始時間の列は左に固定する
	const stickyClass: Partial<Record<(typeof editorState.columns)[number], string>> = {
		nexState: 'sticky left-10 z-[1] w-36 min-w-36',
		start: 'sticky left-46 z-[1] w-18 min-w-18 shadow-[2px_0_0_0_rgba(0,0,0,0.08)]'
	};

	const cellLabel = (rowIndex: number, column: (typeof editorState.columns)[number]) =>
		`${rowIndex + 1}行目 ${columnLabels[column]}`;

	function handleTypeChange(row: (typeof editorState.rows)[0], column: string, value: string) {
		if (column === 'type') {
			row.type = value;
			if (row.type === 'static') {
				row.duration = 0;
			} else if (row.type === 'loop') {
				row.duration = 1200;
			}
		}
	}
</script>

<div
	class="relative max-h-105 min-w-0 flex-1 overflow-auto rounded-lg border border-gray-300 bg-white"
>
	<div class="sticky top-0 left-0 z-30 h-14 w-full">
		<Toolbar />
	</div>
	<table class="w-max border-separate border-spacing-0">
		<thead class="sticky top-14 z-20 bg-gray-200">
			<tr>
				<th
					rowspan="2"
					class="sticky left-0 z-[1] w-10 min-w-10 border-r border-b border-gray-300 bg-gray-200 py-1"
					>#</th
				>
				<th colspan="8" class="border-b border-gray-300 py-1">電光掲示板</th>
				<th colspan="8" class="border-b border-l border-gray-300 py-1">ステージ照明</th>
			</tr>
			<tr>
				{#each editorState.columns as column, i (column)}
					<th
						class={`border-b border-gray-300 bg-gray-200 px-1 py-1 whitespace-nowrap ${i > 0 ? 'border-l' : ''} ${stickyClass[column] ?? ''}`}
					>
						{columnLabels[column]}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each editorState.rows as row, rowIndex (row.id)}
				<tr
					onfocusin={() => (editorState.focusedIndex = rowIndex)}
					class={editorState.focusedIndex === rowIndex
						? 'bg-blue-100'
						: 'odd:bg-white even:bg-gray-50'}
				>
					<td
						class="sticky left-0 z-[1] w-10 min-w-10 border-r border-b border-gray-300 bg-inherit text-center text-sm text-gray-500"
					>
						{rowIndex + 1}
					</td>
					{#each editorState.columns as column, i (column)}
						{@const border = `border-b border-gray-300 ${i > 0 ? 'border-l' : ''} ${stickyClass[column] ? `${stickyClass[column]} bg-inherit` : ''}`}
						{#if column == 'lyric' || column == 'content'}
							<td class={`w-100 p-1 ${border}`}>
								<input
									bind:value={row[column]}
									placeholder={`${placeHolder[column]}`}
									aria-label={cellLabel(rowIndex, column)}
									class="w-full rounded bg-transparent px-1 focus-ring"
								/>
							</td>
						{:else if column == 'nexState'}
							<td class={`p-1 text-center ${border}`}>
								<input
									type="checkbox"
									bind:checked={row[column]}
									aria-label={cellLabel(rowIndex, column)}
									class="cursor-pointer focus-ring"
								/>
							</td>
						{:else if column == 'start' || column == 'duration'}
							{@const isDurationDisabled =
								column === 'duration' && (row.type === 'static' || row.type === 'loop')}
							<td class={`w-18 p-1 ${border}`}>
								<input
									bind:value={row[column]}
									type="number"
									step="0.1"
									min="0"
									placeholder={`${placeHolder[column]}`}
									disabled={isDurationDisabled}
									aria-label={cellLabel(rowIndex, column)}
									class="w-full rounded bg-transparent px-1 focus-ring disabled:cursor-not-allowed disabled:opacity-50"
								/>
							</td>
						{:else if column == 'monitor' || column == 'type'}
							<td class={`w-20 p-1 ${border}`}>
								<select
									name={column}
									bind:value={row[column]}
									id={`${column}-${row.id}-select`}
									aria-label={cellLabel(rowIndex, column)}
									class="cursor-pointer rounded bg-transparent focus-ring"
									onchange={(event) => handleTypeChange(row, column, event.currentTarget.value)}
								>
									{#each Object.entries(options[column as keyof typeof options]) as [optKey, optLabel] (optKey)}
										<option value={optKey === 'default' ? '' : optKey}>{optLabel}</option>
									{/each}
								</select>
							</td>
						{:else if column == 'left' || column == 'right'}
							<td class={`w-17 p-1 ${border}`}>
								<select
									name={column}
									bind:value={row[column]}
									aria-label={cellLabel(rowIndex, column)}
									class="cursor-pointer rounded bg-transparent focus-ring"
									id={`${column}-${row.id}-select`}
								>
									{#each Object.entries(options[column as keyof typeof options]) as [optKey, optLabel] (optKey)}
										<option value={optKey === 'default' ? '' : optKey}>{optLabel}</option>
									{/each}
								</select>
							</td>
						{:else if column == 'color'}
							<td class={`w-15 p-0 ${border}`}>
								<div class="flex items-center justify-center px-px py-0">
									<div
										class="relative h-6 w-6 rounded ring-1 ring-gray-400 focus-within:ring-2 focus-within:ring-accent"
										style={`background-color: ${row[column] !== '' ? row[column] : 'transparent'};`}
									>
										<input
											bind:value={row[column]}
											type="color"
											aria-label={cellLabel(rowIndex, column)}
											class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
										/>
									</div>
								</div>
							</td>
						{:else}
							<td class={`w-18 p-0 ${border}`}>
								<div class="flex items-center justify-center gap-1 px-px py-0">
									<input
										type="checkbox"
										checked={row[column] !== ''}
										aria-label={`${cellLabel(rowIndex, column)} を設定`}
										onchange={(e) => {
											const isChecked = (e.target as HTMLInputElement).checked;
											if (isChecked) {
												// ONにした時、色が空ならデフォルトの黒をセット
												if (row[column] === '') row[column] = '#000000';
											} else {
												// OFFにした時、色をクリア
												row[column] = '';
											}
										}}
										class="cursor-pointer focus-ring"
									/>

									<div
										class={`relative h-6 w-6 rounded ring-1 ring-gray-400 focus-within:ring-2 focus-within:ring-accent ${row[column] === '' ? 'opacity-40' : ''}`}
										style={`background-color: ${row[column] !== '' ? row[column] : 'transparent'};`}
									>
										<input
											bind:value={row[column]}
											type="color"
											disabled={row[column] === ''}
											aria-label={`${cellLabel(rowIndex, column)} の色`}
											class="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
										/>
									</div>
								</div>
							</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
