export const decode = (payload, keyStore) => {
    const id = payload.slice(0, 4);
    const key = keyStore.find(store => store.id === id);
    if (!key) {
        throw new Error('DEFUSER_ZTINYWAVE_KEY_NOT_FOUND');
    }
    const ra = String.fromCharCode(key.reserved1);
    const rb = String.fromCharCode(key.reserved2);
    const unwrap = (input, output, char) => {
        const index = output.indexOf(char);
        if (index >= 0) {
            return input[index];
        }
        return char;
    };
    let mode = 0;
    const data = payload
        .slice(4)
        .split('')
        .map(char => {
        if (!mode) {
            if (char === ra) {
                mode = 1;
                return '';
            }
            if (char === rb) {
                mode = 2;
                return '';
            }
        }
        if (mode === 1) {
            mode = 0;
            if (key.reserved1Output.includes(char)) {
                return unwrap(key.reserved1Input, key.reserved1Output, char);
            }
            return unwrap(key.input, key.output, char) + char;
        }
        if (mode === 2) {
            mode = 0;
            if (key.reserved2Output.includes(char)) {
                return unwrap(key.reserved2Input, key.reserved2Output, char);
            }
            return unwrap(key.input, key.output, char) + char;
        }
        return unwrap(key.input, key.output, char);
    })
        .join('');
    return JSON.parse(data);
};
//# sourceMappingURL=ztinywave.js.map