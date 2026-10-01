export type ToastKind = 'info' | 'error';

export interface Toast {
	id: number;
	kind: ToastKind;
	message: string;
}

// alert() の代わりに画面右下へ通知を表示する
class ToastState {
	toasts = $state<Toast[]>([]);
	private nextId = 0;

	show(message: string, kind: ToastKind = 'info', timeout = 5000) {
		const id = this.nextId++;
		this.toasts.push({ id, kind, message });
		setTimeout(() => this.dismiss(id), timeout);
	}

	error(message: string) {
		this.show(message, 'error', 8000);
	}

	dismiss(id: number) {
		this.toasts = this.toasts.filter((t) => t.id !== id);
	}
}

export const toastState = new ToastState();
