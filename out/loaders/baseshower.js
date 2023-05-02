export const decode = (binary) => {
    const buffer = Buffer.from(binary, 'base64');
    let text = '';
    for (const partial of buffer) {
        text += String.fromCharCode(partial ^ buffer[0]);
    }
    return JSON.parse(text.slice(1));
};
//# sourceMappingURL=baseshower.js.map