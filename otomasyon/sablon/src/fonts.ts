import {continueRender, delayRender, staticFile} from 'remotion';

const LATIN =
	'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT =
	'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

const faces: Array<[string, string, string, string]> = [
	['Cinzel', 'cinzel-latin-600-normal.woff2', '600', 'normal'],
	['Cinzel', 'cinzel-latin-ext-600-normal.woff2', '600', 'normal'],
	['Cormorant', 'cormorant-garamond-latin-500-italic.woff2', '500', 'italic'],
	['Cormorant', 'cormorant-garamond-latin-ext-500-italic.woff2', '500', 'italic'],
	['Inter', 'inter-latin-500-normal.woff2', '500', 'normal'],
	['Inter', 'inter-latin-ext-500-normal.woff2', '500', 'normal'],
];

let loaded = false;

export const loadFonts = () => {
	if (loaded) return;
	loaded = true;
	const handle = delayRender('fonts');
	Promise.all(
		faces.map(([family, file, weight, style]) => {
			const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, {
				weight,
				style,
				unicodeRange: file.includes('latin-ext') ? LATIN_EXT : LATIN,
			});
			return face.load().then((f) => document.fonts.add(f));
		})
	)
		.then(() => continueRender(handle))
		.catch((e) => {
			console.error(e);
			continueRender(handle);
		});
};

export const FONT = {
	display: 'Cinzel, serif',
	serif: 'Cormorant, serif',
	sans: 'Inter, sans-serif',
};
