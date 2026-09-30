import { editorState } from './editorState.svelte';
import { toastState } from './toastState.svelte';
import { hasInvalidFileNamePart, parseFileName } from '$lib/utils/fileNameparser';
import { CSVError, parseEditCSV } from '$lib/utils/csvImporter';
import { downloadAllFiles } from '$lib/utils/csvExporter';

function takeSnapshot() {
	return JSON.stringify({
		groupName: editorState.groupName,
		songName: editorState.songName,
		rows: editorState.rows
	});
}

class FileState {
	// 最後にインポート/ダウンロードした時点の内容 (未保存の変更検知用)
	private savedSnapshot = takeSnapshot();

	hasUnsavedChanges() {
		return takeSnapshot() !== this.savedSnapshot;
	}

	async importCSV(file: File) {
		const parsed = parseFileName(file.name);

		const rows = await parseEditCSV(file);
		if (
			this.hasUnsavedChanges() &&
			!confirm('CSVファイルをインポートすると未保存の編集内容が失われます。続行しますか?')
		) {
			throw new CSVError('CSV_IMPORT_CANCELED', 'インポートがキャンセルされました');
		}
		editorState.rows = rows;
		editorState.focusedIndex = null;
		if (parsed) {
			editorState.groupName = parsed.groupName;
			editorState.songName = parsed.songName;
		}
		this.savedSnapshot = takeSnapshot();
	}

	exportCSV() {
		// 1. 空白チェック
		if (!editorState.groupName.trim() || !editorState.songName.trim()) {
			toastState.error('グループ名と曲名を入力してください');
			return;
		}

		// 2. 不正文字チェック
		if (
			hasInvalidFileNamePart(editorState.groupName) ||
			hasInvalidFileNamePart(editorState.songName, true)
		) {
			toastState.error(
				'ファイル名に使用できない文字が含まれています。赤枠のエラーを修正してください。'
			);
			return;
		}

		// 3. ダウンロード実行
		try {
			downloadAllFiles(editorState.rows, editorState.groupName, editorState.songName);
			this.savedSnapshot = takeSnapshot();
		} catch (error) {
			toastState.error(error instanceof Error ? error.message : 'CSVのダウンロードに失敗しました');
		}
	}
}

export const fileState = new FileState();
