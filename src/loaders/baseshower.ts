export const decode = (binary: string) => {
	binary = Buffer.from(binary, 'base64').toString('binary');

	const key = binary.charCodeAt(0);
	const buffer = new Uint8Array(binary.length - 1);

	for (let i = 1; i < binary.length; i++) {
		buffer[i - 1] = binary.charCodeAt(i) ^ key;
	}

	const decoder = new TextDecoder();
	const out = decoder.decode(buffer);

	return JSON.parse(decodeURIComponent(out)) as Array<{tags: string} | {text_id: string; text_value: string}>;
};
