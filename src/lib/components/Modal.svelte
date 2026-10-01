<svelte:options runes={true} />

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';

	let {
		show = false,
		onClose = () => {},
		label = '',
		children,
		footer
	}: {
		show?: boolean;
		onClose?: () => void;
		label?: string;
		children: Snippet;
		footer?: Snippet;
	} = $props();

	let dialog: HTMLDivElement | undefined = $state();
	let previousFocus: HTMLElement | null = null;

	// 開いたらダイアログにフォーカスを移し、閉じたら元の位置に戻す
	$effect(() => {
		if (show) {
			previousFocus = document.activeElement as HTMLElement | null;
			tick().then(() => dialog?.focus());
			return () => previousFocus?.focus();
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			onClose();
			return;
		}
		// Tab キーのフォーカスをダイアログ内に閉じ込める
		if (e.key === 'Tab' && dialog) {
			const focusables = dialog.querySelectorAll<HTMLElement>(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			if (focusables.length === 0) return;
			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}
</script>

{#if show}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-100 flex items-center justify-center bg-black/50"
		onclick={(e) => {
			if (e.target === e.currentTarget) onClose();
		}}
	>
		<div
			bind:this={dialog}
			role="dialog"
			aria-modal="true"
			aria-label={label}
			tabindex="-1"
			onkeydown={handleKeydown}
			class="flex max-h-3/4 max-w-4/5 flex-col overflow-auto rounded-lg bg-white p-5 shadow-md outline-none"
		>
			{@render children()}
			<div class="mt-5 flex items-center justify-end gap-4">
				{@render footer?.()}
				<button onclick={onClose} class="btn btn-secondary text-lg">閉じる</button>
			</div>
		</div>
	</div>
{/if}
