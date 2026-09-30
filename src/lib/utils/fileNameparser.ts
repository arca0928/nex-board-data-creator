export function parseFileName(filename: string): { groupName: string; songName: string } | null {
	if (!/\.csv$/i.test(filename)) {
		return null;
	}

	const baseName = filename.replace(/\.csv$/i, '');

	const lastUnderscoreIndex = baseName.lastIndexOf('__');
	if (lastUnderscoreIndex === -1) {
		return null;
	}

	const groupName = baseName.substring(0, lastUnderscoreIndex);
	const songName = baseName.substring(lastUnderscoreIndex + 2);

	if (!groupName || !songName) {
		return null;
	}

	return { groupName, songName };
}

export function hasInvalidFileNamePart(s: string, isSong = false): boolean {
	const hasInvalidChar = /[^a-zA-Z0-9_().-]/;
	return hasInvalidChar.test(s) || s.includes('__') || (isSong && s.startsWith('_'));
}
