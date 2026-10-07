import type { Row } from '$lib/types/csv';

export const CSV_COLUMNS = [
	'nexState',
	'start',
	'lyric',
	'duration',
	'monitor',
	'type',
	'color',
	'content',
	'left',
	'backOne',
	'backTwo',
	'backThree',
	'backFour',
	'backFive',
	'backSix',
	'right',
	'remarks'
] as const satisfies readonly (keyof Row)[];

export function validateRows(rows: Row[]) {
	if (rows.length === 0) throw new Error('CSVにデータ行がありません');
	rows.forEach((row, index) => {
		const fail = (column: string) => {
			throw new Error(`${index + 1}行目の ${column} が不正です`);
		};
		if (typeof row.nexState !== 'boolean') fail('nexState');
		for (const column of ['start', 'duration'] as const) {
			if (typeof row[column] !== 'number' || !Number.isFinite(row[column]) || row[column] < 0) {
				fail(column);
			}
		}
		for (const column of CSV_COLUMNS) {
			if (
				column !== 'nexState' &&
				column !== 'start' &&
				column !== 'duration' &&
				typeof row[column] !== 'string'
			)
				fail(column);
		}
		if (!['', 'main', 'sub'].includes(row.monitor)) fail('monitor');
		if (!['', 'slide', 'static', 'loop'].includes(row.type)) fail('type');
		for (const column of ['left', 'right'] as const) {
			if (!['', 'on', 'off'].includes(row[column])) fail(column);
		}
		for (const column of [
			'color',
			'backOne',
			'backTwo',
			'backThree',
			'backFour',
			'backFive',
			'backSix'
		] as const) {
			if (row[column] !== '' && !/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(row[column])) fail(column);
		}
	});
}
