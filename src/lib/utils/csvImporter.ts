import Papa from 'papaparse';
import type { Row } from '$lib/types/csv';
import { CSV_COLUMNS, validateRows } from './csvValidation';

type CSVErrorType =
	| 'CSV_FORMAT_ERROR'
	| 'CSV_IMPORT_ERROR'
	| 'CSV_DATA_ERROR'
	| 'CSV_IMPORT_CANCELED';
export class CSVError extends Error {
	constructor(
		public type: CSVErrorType,
		message: string
	) {
		super(message);
	}
}

export function parseEditCSV(file: File): Promise<Row[]> {
	return new Promise((resolve, reject) => {
		Papa.parse<Record<string, string>>(file, {
			header: true,
			skipEmptyLines: 'greedy',
			complete: (results) => {
				try {
					const fields = results.meta.fields ?? [];
					if (CSV_COLUMNS.some((field) => !fields.includes(field))) {
						throw new CSVError('CSV_FORMAT_ERROR', 'CSVの必須列が不足しています');
					}
					if (results.errors.length || Object.keys(results.meta.renamedHeaders ?? {}).length) {
						throw new CSVError(
							'CSV_DATA_ERROR',
							results.errors[0]?.message ?? 'CSVの列名が重複しています'
						);
					}
					const rows: Row[] = results.data.map((data, index) => {
						const number = (column: 'start' | 'duration') => {
							const value = data[column]?.trim();
							if (!value || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value)) {
								throw new Error(`${index + 1}行目の ${column} が数値ではありません`);
							}
							return Number(value);
						};
						const flag = data.nexState?.trim();
						if (flag !== 'true' && flag !== 'false')
							throw new Error(`${index + 1}行目の nexState が不正です`);
						return {
							id: crypto.randomUUID(),
							nexState: flag === 'true',
							start: number('start'),
							duration: number('duration'),
							lyric: data.lyric,
							monitor: data.monitor,
							type: data.type,
							color: data.color,
							content: data.content,
							left: data.left,
							backOne: data.backOne,
							backTwo: data.backTwo,
							backThree: data.backThree,
							backFour: data.backFour,
							backFive: data.backFive,
							backSix: data.backSix,
							right: data.right
						};
					});
					validateRows(rows);
					resolve(rows);
				} catch (error) {
					reject(
						error instanceof CSVError
							? error
							: new CSVError(
									'CSV_DATA_ERROR',
									error instanceof Error ? error.message : 'CSVデータが不正です'
								)
					);
				}
			},
			error: (error) =>
				reject(new CSVError('CSV_IMPORT_ERROR', error.message || 'CSVの読み込みに失敗しました'))
		});
	});
}
