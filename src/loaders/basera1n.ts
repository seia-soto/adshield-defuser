import {escape} from 'querystring';

export const decode = (init: string) => {
	const a = Buffer.from(init, 'base64').toString('utf8');
	const payload = a.substring(2);

	let key = parseInt(a.slice(0, 2), 16);
	let out = '';

	if (key < 16 || key > 255) {
		key = Math.abs(key % 239);
	}

	for (const char of payload) {
		out += String.fromCharCode(key ^ char.charCodeAt(0));
	}

	if (typeof process !== 'undefined' && process.release.name === 'node') {
		throw new Error('ASKIT_BASERA1N_UNSUPPORTED_PLATFORM');
	}

	return decodeURIComponent(escape(out));
};
