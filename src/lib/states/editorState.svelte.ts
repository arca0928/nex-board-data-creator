import type { Row } from '$lib/types/csv';
import { CSV_COLUMNS } from '$lib/utils/csvValidation';
import { toastState } from './toastState.svelte';
import { MediaUploader } from '$lib/utils/mediaUploader';
import type { YTPlayer } from '$lib/utils/youtubeLoader';

export interface MediaSource {
	type: 'youtube' | 'file';
	youtubeId?: string; // YouTube動画ID
	fileUrl?: string; // ローカルファイルURL
	fileName?: string; // ファイル名
	mimeType?: string; // 'video/mp4' | 'audio/mpeg' など
}

class PlayerState {
	// メディア情報
	mediaSource = $state<MediaSource | null>(null);

	// 再生制御
	isPlaying = $state(false);
	currentTime = $state(0); // 秒単位
	duration = $state(0); // 秒単位
	volume = $state(100); // 0-100

	// プレイヤーリファレンス（video/audio 要素またはYouTube Player）
	playerRef = $state<HTMLVideoElement | HTMLAudioElement | YTPlayer | null>(null);

	setMediaSource(source: MediaSource | null) {
		this.pause();
		this.playerRef = null;
		if (this.mediaSource?.type === 'file' && this.mediaSource.fileUrl) {
			MediaUploader.revokeBlobUrl(this.mediaSource.fileUrl);
		}
		this.mediaSource = source;
		this.currentTime = 0;
		this.duration = 0;
	}

	// プレイヤーから直接取得した正確な再生位置 (秒, 小数あり)
	getExactTime(): number {
		const ref = this.playerRef;
		if (ref) {
			if ('currentTime' in ref) return ref.currentTime;
			if ('getCurrentTime' in ref && typeof ref.getCurrentTime === 'function') {
				return ref.getCurrentTime();
			}
		}
		return this.currentTime;
	}

	updateCurrentTime(time: number) {
		this.currentTime = time;
	}

	setDuration(duration: number) {
		this.duration = duration;
	}

	play() {
		const ref = this.playerRef;
		if (!ref) return;
		this.isPlaying = true;
		if (this.playerRef) {
			if ('playVideo' in this.playerRef && typeof this.playerRef.playVideo === 'function') {
				// YouTube Player
				this.playerRef.playVideo();
			} else if ('play' in this.playerRef && typeof this.playerRef.play === 'function') {
				// HTML5 video/audio
				void this.playerRef.play().catch(() => {
					if (this.playerRef !== ref) return;
					this.isPlaying = false;
					toastState.error('メディアを再生できませんでした');
				});
			}
		}
	}

	pause() {
		this.isPlaying = false;
		if (this.playerRef) {
			if ('pauseVideo' in this.playerRef && typeof this.playerRef.pauseVideo === 'function') {
				// YouTube Player
				this.playerRef.pauseVideo();
			} else if ('pause' in this.playerRef && typeof this.playerRef.pause === 'function') {
				// HTML5 video/audio
				this.playerRef.pause();
			}
		}
	}

	seek(time: number) {
		this.currentTime = time;
		if (this.playerRef) {
			if ('currentTime' in this.playerRef) {
				// HTML5 video/audio
				this.playerRef.currentTime = time;
			} else if ('seekTo' in this.playerRef && typeof this.playerRef.seekTo === 'function') {
				// YouTube Player
				this.playerRef.seekTo(time);
			}
		}
	}
}
class EditorState {
	groupName = $state('');
	songName = $state('');
	rows = $state<Row[]>([]);
	columns = CSV_COLUMNS;

	focusedIndex = $state<number | null>(null);

	playerState = new PlayerState();

	constructor() {
		this.rows = [this.createEmptyRow()];
	}

	private createEmptyRow(): Row {
		return {
			id: crypto.randomUUID(),
			nexState: true,
			start: 0,
			lyric: '',
			duration: 0,
			monitor: '',
			type: '',
			color: '#fde047',
			content: '',
			left: '',
			backOne: '',
			backTwo: '',
			backThree: '',
			backFour: '',
			backFive: '',
			backSix: '',
			right: '',
			remarks: ''
		};
	}

	addRow() {
		const newRow = this.createEmptyRow();
		if (this.focusedIndex !== null) {
			this.rows.splice(this.focusedIndex + 1, 0, newRow);
			this.focusedIndex = this.focusedIndex + 1;
		} else {
			this.rows.push(newRow);
		}
	}

	deleteRow() {
		if (this.focusedIndex === null) return;
		this.rows.splice(this.focusedIndex, 1);
		if (this.rows.length === 0) {
			this.rows.push(this.createEmptyRow());
		}
		this.focusedIndex = Math.min(this.focusedIndex, this.rows.length - 1);
	}
}
export const editorState = new EditorState();
