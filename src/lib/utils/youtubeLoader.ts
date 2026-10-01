let apiPromise: Promise<void> | null = null;

export function loadYouTubeAPI(): Promise<void> {
	if (window.YT?.Player) return Promise.resolve();
	if (apiPromise) return apiPromise;
	apiPromise = new Promise<void>((resolve, reject) => {
		const previousReady = window.onYouTubeIframeAPIReady;
		const script = document.createElement('script');
		const cleanup = () => {
			clearTimeout(timeout);
			script.onerror = null;
			window.onYouTubeIframeAPIReady = previousReady;
		};
		const fail = () => {
			cleanup();
			script.remove();
			reject(new Error('YouTube APIを読み込めませんでした'));
		};
		const timeout = setTimeout(fail, 15000);
		window.onYouTubeIframeAPIReady = () => {
			cleanup();
			resolve();
			previousReady?.();
		};
		script.src = 'https://www.youtube.com/iframe_api';
		script.async = true;
		script.onerror = fail;
		document.body.appendChild(script);
	}).catch((error: unknown) => {
		apiPromise = null;
		throw error;
	});
	return apiPromise;
}

declare global {
	interface Window {
		YT: {
			Player: {
				new (element: HTMLElement | string, options: YTPlayerOptions): YTPlayer;
			};
			PlayerState: YTPlayerState;
		};
		onYouTubeIframeAPIReady: (() => void) | undefined;
	}
}

// YouTube Player API の型定義
export interface YTPlayerOptions {
	videoId: string;
	height?: string | number;
	width?: string | number;
	playerVars?: Record<string, unknown>;
	events?: {
		onReady?: (event: YTOnReadyEvent) => void;
		onStateChange?: (event: YTOnStateChangeEvent) => void;
		onError?: (event: { data: number; target: YTPlayer }) => void;
	};
}

export interface YTOnReadyEvent {
	target: YTPlayer;
}

export interface YTOnStateChangeEvent {
	data: number;
	target: YTPlayer;
}

export interface YTPlayer {
	getPlayerState(): number;
	getCurrentTime(): number;
	getDuration(): number;
	getVolume(): number;
	setVolume(volume: number): void;
	playVideo(): void;
	pauseVideo(): void;
	seekTo(seconds: number): void;
	destroy(): void;
}

export interface YTPlayerState {
	UNSTARTED: number;
	ENDED: number;
	PLAYING: number;
	PAUSED: number;
	BUFFERING: number;
	CUED: number;
}
