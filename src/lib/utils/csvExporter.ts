import Papa from 'papaparse';
import type { Row } from '$lib/types/csv';
import { validateRows } from './csvValidation';

export function generateCSVFiles(rows: Row[]) {
	validateRows(rows);
	const csvRows = rows.map((row) => ({
		nexState: row.nexState,
		start: row.start,
		lyric: row.lyric,
		duration: row.duration,
		monitor: row.monitor,
		type: row.type,
		color: row.color,
		content: row.content,
		left: row.left,
		backOne: row.backOne,
		backTwo: row.backTwo,
		backThree: row.backThree,
		backFour: row.backFour,
		backFive: row.backFive,
		backSix: row.backSix,
		right: row.right
	}));

	return {
		csv: Papa.unparse(csvRows)
	};
}

export function downloadFile(content: string, filename: string) {
	const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);

	link.setAttribute('href', url);
	link.setAttribute('download', filename);
	link.style.visibility = 'hidden';

	document.body.appendChild(link);
	try {
		link.click();
	} finally {
		link.remove();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	}
}

export function downloadAllFiles(rows: Row[], groupName: string, songName: string) {
	const csvFiles = generateCSVFiles(rows);
	const baseFileName = `${groupName}__${songName}`;

	downloadFile(csvFiles.csv, `${baseFileName}.csv`);
}
