// @ts-expect-error Known properties
export const isTag = (payload) => typeof payload.tags === 'string';
// @ts-expect-error Known properties
export const isText = (payload) => typeof payload.text_id === 'string' && typeof payload.text_value === 'string';
export const decode = (binary) => {
    binary = Buffer.from(binary, 'base64').toString('binary');
    const key = binary.charCodeAt(0);
    const buffer = new Uint8Array(binary.length - 1);
    for (let i = 1; i < binary.length; i++) {
        buffer[i - 1] = binary.charCodeAt(i) ^ key;
    }
    const decoder = new TextDecoder();
    const out = decoder.decode(buffer);
    return JSON.parse(decodeURIComponent(out));
};
//# sourceMappingURL=baseshower.js.map