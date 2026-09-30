<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import { usePreviewClock } from '$lib/utils/timing.svelte';

	// 共有タイミングロジックの使用
	const clock = usePreviewClock();

	const lightColumns = [
		'left',
		'right',
		'backOne',
		'backTwo',
		'backThree',
		'backFour',
		'backFive',
		'backSix'
	] as const;

	const lightTimelines = $derived.by(() => {
		const sorted = [...editorState.rows].sort((a, b) => a.start - b.start);
		return lightColumns.map((column) => ({
			column,
			events: sorted
				.filter((row) => row[column] !== '')
				.map((row) => ({ start: row.start, value: row[column] }))
		}));
	});

	const activeColors = $derived.by(() => {
		const time = clock.time;
		const colors: Record<string, string> = {};
		for (const { column, events } of lightTimelines) {
			let low = 0;
			let high = events.length;
			while (low < high) {
				const middle = Math.floor((low + high) / 2);
				if (events[middle].start <= time) low = middle + 1;
				else high = middle;
			}
			colors[column] = low > 0 ? events[low - 1].value : '#000000';
		}
		return colors;
	});

	const backLights = [
		{ key: 'backOne', label: '1' },
		{ key: 'backTwo', label: '2' },
		{ key: 'backThree', label: '3' },
		{ key: 'backFour', label: '4' },
		{ key: 'backFive', label: '5' },
		{ key: 'backSix', label: '6' }
	] as const;

	// サイド照明は白点灯/消灯のみ (未設定は消灯扱い)
	function sideColor(value: string) {
		return value === 'on' ? '#ffffff' : '#000000';
	}

	// ライトがオフ（黒）の場合は光らせない制御
	function getGlow(color: string) {
		const isOff = !color || color === '#000000' || color === '#000' || color === 'off';
		return isOff ? 'none' : `0 0 25px ${color}`;
	}
</script>

<!-- 実際のステージ配置: 左サイド | バック1〜6 | 右サイド -->
<div class="rounded-2xl bg-[#0a0a0a] px-3 py-4 text-white">
	<div class="flex items-end justify-between">
		{@render sideLight('左', activeColors.left)}
		<div class="flex flex-col items-center gap-1">
			<div class="flex gap-2">
				{#each backLights as light (light.key)}
					<div class="flex flex-col items-center gap-1">
						<div
							class="h-7 w-7 rounded-full ring-1 ring-white/25 transition-all duration-200"
							style:background={activeColors[light.key]}
							style:box-shadow={getGlow(activeColors[light.key])}
						></div>
						<div class="text-xs">{light.label}</div>
					</div>
				{/each}
			</div>
			<div class="text-xs text-gray-400">バック</div>
		</div>
		{@render sideLight('右', activeColors.right)}
	</div>
</div>

{#snippet sideLight(label: string, value: string)}
	<div class="flex flex-col items-center gap-1">
		<div
			class="h-7 w-5 rounded ring-1 ring-white/25 transition-all duration-200"
			style:background={sideColor(value)}
			style:box-shadow={getGlow(sideColor(value))}
		></div>
		<div class="text-xs">{label}</div>
		<div class="text-xs text-gray-400">サイド</div>
	</div>
{/snippet}
