<script lang="ts">
	import { toastState } from '$lib/states/toastState.svelte';
</script>

<div class="fixed right-4 bottom-10 z-200 flex w-96 flex-col gap-2" aria-live="polite">
	{#each toastState.toasts as toast (toast.id)}
		<div
			role={toast.kind === 'error' ? 'alert' : 'status'}
			class={`flex items-start gap-2 rounded-lg border px-4 py-3 shadow-md ${toast.kind === 'error' ? 'border-red-300 bg-red-50 text-red-800' : 'border-gray-300 bg-white text-gray-800'}`}
		>
			<p class="flex-1">{toast.message}</p>
			<button
				class="cursor-pointer rounded px-1 text-gray-500 focus-ring hover:text-gray-800"
				aria-label="通知を閉じる"
				onclick={() => toastState.dismiss(toast.id)}
			>
				✕
			</button>
		</div>
	{/each}
</div>
