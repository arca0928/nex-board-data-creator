<script lang="ts">
	import { editorState } from '$lib/states/editorState.svelte';
	import YouTubePlayer from './player/YouTubePlayer.svelte';
	import LocalMediaPlayer from './player/LocalMediaPlayer.svelte';
	import YouTubeInput from './player/YouTubeInput.svelte';
	import MediaUploadInput from './player/MediaUploadInput.svelte';

	let sourceMode = $state<'youtube' | 'file' | null>(null);
	const playerState = editorState.playerState;
</script>

<div class="w-80 overflow-hidden rounded-lg border border-gray-300 bg-white">
	<div class="flex border-b border-gray-300 bg-gray-100" role="tablist" aria-label="再生ソース">
		<button
			role="tab"
			aria-selected={sourceMode === 'youtube'}
			class={`flex-1 cursor-pointer px-3 py-2 focus-ring ${sourceMode === 'youtube' ? 'border-b-2 border-red-500 font-bold' : ''}`}
			onclick={() => (sourceMode = 'youtube')}
		>
			YouTube
		</button>
		<button
			role="tab"
			aria-selected={sourceMode === 'file'}
			class={`flex-1 cursor-pointer px-3 py-2 focus-ring ${sourceMode === 'file' ? 'border-b-2 border-accent font-bold' : ''}`}
			onclick={() => (sourceMode = 'file')}
		>
			ファイル
		</button>
	</div>

	<!-- コンテンツエリア -->
	<div role="tabpanel">
		{#if sourceMode === 'youtube'}
			{#if playerState.mediaSource?.type === 'youtube' && playerState.mediaSource.youtubeId}
				<div class="aspect-video w-full bg-black">
					<YouTubePlayer videoId={playerState.mediaSource.youtubeId} />
				</div>
			{:else}
				<div class="p-3">
					<YouTubeInput />
				</div>
			{/if}
		{:else if sourceMode === 'file'}
			{#if playerState.mediaSource?.type === 'file'}
				<LocalMediaPlayer source={playerState.mediaSource} />
			{:else}
				<div class="p-3">
					<MediaUploadInput />
				</div>
			{/if}
		{:else}
			<div class="p-4 text-center text-gray-500">ソースを選択してください</div>
		{/if}
	</div>

	<!-- 再生コントロール -->
	{#if playerState.mediaSource}
		<div class="flex flex-col gap-2 border-t border-gray-300 bg-gray-50 p-2">
			<div class="flex items-center gap-2">
				<button
					onclick={() => (playerState.isPlaying ? playerState.pause() : playerState.play())}
					aria-label={playerState.isPlaying ? '一時停止' : '再生'}
					title={playerState.isPlaying ? '一時停止' : '再生'}
					class="btn w-10 btn-secondary px-0"
				>
					{playerState.isPlaying ? '⏸' : '▶'}
				</button>
				<input
					type="range"
					min="0"
					max={playerState.duration}
					step="0.1"
					value={playerState.currentTime}
					aria-label="再生位置"
					onchange={(e) => {
						const value = (e.target as HTMLInputElement).value;
						playerState.seek(+value);
					}}
					class="flex-1 cursor-pointer accent-accent"
				/>
			</div>
			<div class="flex items-center gap-2">
				<label for="volume" class="text-sm text-gray-600">音量</label>
				<input
					id="volume"
					type="range"
					min="0"
					max="100"
					value={playerState.volume}
					oninput={(e) => {
						const volume = +(e.target as HTMLInputElement).value;
						const ref = playerState.playerRef;

						if (ref && 'setVolume' in ref) {
							ref.setVolume(volume);
						} else if (ref && 'volume' in ref) {
							ref.volume = volume / 100;
						}
						playerState.volume = volume;
					}}
					class="w-24 cursor-pointer accent-accent"
				/>
				<button
					class="ml-auto btn btn-secondary px-2 py-0.5 text-sm"
					onclick={() => editorState.playerState.setMediaSource(null)}
				>
					ソースを削除
				</button>
			</div>
		</div>
	{/if}
</div>
