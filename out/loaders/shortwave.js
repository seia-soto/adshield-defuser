import { ProtobufWireTypes, getProtobufFields, getProtobufMap } from '../utils/protobuf.js';
export const getMessageParts = (binary) => [binary.slice(0, 4), binary.slice(4)];
export const getKeySources = (script) => {
    const pattern = /['"]?[\w]+['"]?: ?\[[ \n\dxa-f,]+\]/gm;
    const sources = script.match(pattern);
    if (!sources) {
        throw new Error('DEFUSER_NO_KEY_SOURCE_FOUND');
    }
    const stores = {};
    for (const source of sources) {
        let [prefix, buffer] = source.split(':');
        prefix = prefix.replace(/['"]/g, '');
        // Prepare for other form of numbers
        const seq = buffer.slice(1, -1).split(',').map(arbitary => {
            const hexable = arbitary.trim();
            // Get the divider
            switch (hexable[1]) {
                case 'b': {
                    return parseInt(hexable, 2);
                }
                case 'x': {
                    return parseInt(hexable, 16);
                }
                default: {
                    return parseInt(hexable, 10);
                }
            }
        });
        stores[prefix] = Buffer.from(seq);
    }
    return stores;
};
export var KeyStoreFieldNames;
(function (KeyStoreFieldNames) {
    KeyStoreFieldNames[KeyStoreFieldNames["id"] = 1] = "id";
    KeyStoreFieldNames[KeyStoreFieldNames["version"] = 2] = "version";
    KeyStoreFieldNames[KeyStoreFieldNames["details"] = 10] = "details";
})(KeyStoreFieldNames || (KeyStoreFieldNames = {}));
export var KeyStoreDetailsFieldNames;
(function (KeyStoreDetailsFieldNames) {
    KeyStoreDetailsFieldNames[KeyStoreDetailsFieldNames["input"] = 1] = "input";
    KeyStoreDetailsFieldNames[KeyStoreDetailsFieldNames["output"] = 2] = "output";
    KeyStoreDetailsFieldNames[KeyStoreDetailsFieldNames["reserved"] = 3] = "reserved";
    KeyStoreDetailsFieldNames[KeyStoreDetailsFieldNames["reservedInput"] = 4] = "reservedInput";
    KeyStoreDetailsFieldNames[KeyStoreDetailsFieldNames["reservedOutput"] = 5] = "reservedOutput";
})(KeyStoreDetailsFieldNames || (KeyStoreDetailsFieldNames = {}));
export const getKeyStore = (keySource) => {
    const aFields = getProtobufFields(keySource);
    const aMap = getProtobufMap(KeyStoreFieldNames, aFields);
    if (aMap?.details?.wireType !== ProtobufWireTypes.Binary) {
        throw new Error('DEFUSER_KEY_STORE_LEVEL_B_SOURCE_NOT_FOUND');
    }
    return {
        ...aMap,
        details: {
            id: 10,
            wireType: ProtobufWireTypes.Nested,
            value: getProtobufMap(KeyStoreDetailsFieldNames, getProtobufFields(aMap.details.value)),
        },
    };
};
export const getDeterminedChar = (a, b, c) => {
    if (c.length !== 1) {
        throw new Error('DEFUSER_UNEXPECTED_DETERMINISTIC_CHARACTER_LENGTH');
    }
    if (b.includes(c)) {
        return a[b.indexOf(c)];
    }
    return c;
};
export const getDecodedBinaryWithKeyStore = (keyStore, binary) => {
    const { reserved, reservedInput, reservedOutput, input, output } = keyStore.details.value;
    if (!reserved || !reservedInput || !reservedOutput || !input || !output) {
        throw new Error('DEFUSER_KEY_DETAILS_INSUFFICIENT');
    }
    if (reserved.wireType !== ProtobufWireTypes.Uint32) {
        throw new Error('DEFUSER_UNEXPECTED_KEY_RESERVED_TYPE');
    }
    if (reservedOutput.wireType !== ProtobufWireTypes.Binary) {
        throw new Error('DEFUSER_UNEXPECTED_KEY_RESERVED_OUTPUT_TYPE');
    }
    if (reservedInput.wireType !== ProtobufWireTypes.Binary) {
        throw new Error('DEFUSER_UNEXPECTED_KEY_RESERVED_INPUT_TYPE');
    }
    if (input.wireType !== ProtobufWireTypes.Binary) {
        throw new Error('DEFUSER_UNEXPECTED_KEY_INPUT_TYPE');
    }
    if (output.wireType !== ProtobufWireTypes.Binary) {
        throw new Error('DEFUSER_UNEXPECTED_KEY_OUTPUT_TYPE');
    }
    const inputStr = input.value.toString();
    const outputStr = output.value.toString();
    const reservedOutputStr = reservedOutput.value.toString();
    const reservedInputStr = reservedInput.value.toString();
    let isPreviousCharacterReserved = false;
    let out = '';
    for (const char of binary) {
        if (!isPreviousCharacterReserved && char === String.fromCharCode(reserved.value)) {
            isPreviousCharacterReserved = true;
            continue;
        }
        if (!isPreviousCharacterReserved) {
            out += getDeterminedChar(inputStr, outputStr, char);
            continue;
        }
        isPreviousCharacterReserved = false;
        if (reservedOutputStr.includes(char)) {
            out += getDeterminedChar(reservedInputStr, reservedOutputStr, char);
            continue;
        }
        out += getDeterminedChar(inputStr, outputStr, char) + char;
    }
    return out;
};
export const getDictionarySources = (script) => {
    const pattern = /"[\w\d]+",\[[\d,]+\],\[["\w\d,]+\]/gm;
    const sources = script.match(pattern);
    if (!sources) {
        throw new Error('DEFUSER_NO_DICTIONARY_SOURCE_FOUND');
    }
    const stores = {};
    for (const source of sources) {
        const [_prefix, ...rest] = source.split(',[');
        const prefix = _prefix.slice(1, -1);
        stores[prefix] = rest.join(',[');
    }
    return stores;
};
export const getDictionaryStore = (source) => {
    const [_reserved, _dictionary] = source.split(',[');
    const reserved = JSON.parse(`[${_reserved}`);
    const dictionary = JSON.parse(`[${_dictionary}`);
    return {
        reserved,
        dictionary,
    };
};
export const getDecodedBinaryWithDictionaryStore = (dictionaryStore, binary) => {
    const out = [];
    let reserved = '';
    for (const char of binary) {
        if (reserved.length) {
            out.push(dictionaryStore.dictionary.indexOf(reserved + char));
            reserved = '';
            continue;
        }
        if (dictionaryStore.reserved.includes(char.charCodeAt(0))) {
            reserved = char;
            continue;
        }
        out.push(dictionaryStore.dictionary.indexOf(char));
    }
    return Buffer.from(out);
};
export var PayloadFieldNames;
(function (PayloadFieldNames) {
    PayloadFieldNames[PayloadFieldNames["version"] = 1] = "version";
    PayloadFieldNames[PayloadFieldNames["details"] = 10] = "details";
})(PayloadFieldNames || (PayloadFieldNames = {}));
export var PayloadV1Types;
(function (PayloadV1Types) {
    PayloadV1Types[PayloadV1Types["Head"] = 0] = "Head";
    PayloadV1Types[PayloadV1Types["Text"] = 2] = "Text";
})(PayloadV1Types || (PayloadV1Types = {}));
export var PayloadV1FieldNames;
(function (PayloadV1FieldNames) {
    PayloadV1FieldNames[PayloadV1FieldNames["type"] = 1] = "type";
    PayloadV1FieldNames[PayloadV1FieldNames["head"] = 10] = "head";
    PayloadV1FieldNames[PayloadV1FieldNames["text"] = 12] = "text";
})(PayloadV1FieldNames || (PayloadV1FieldNames = {}));
export var PayloadV1HeadFieldNames;
(function (PayloadV1HeadFieldNames) {
    PayloadV1HeadFieldNames[PayloadV1HeadFieldNames["code"] = 1] = "code";
})(PayloadV1HeadFieldNames || (PayloadV1HeadFieldNames = {}));
export var PayloadV1TextFieldNames;
(function (PayloadV1TextFieldNames) {
    PayloadV1TextFieldNames[PayloadV1TextFieldNames["id"] = 1] = "id";
    PayloadV1TextFieldNames[PayloadV1TextFieldNames["text"] = 2] = "text";
})(PayloadV1TextFieldNames || (PayloadV1TextFieldNames = {}));
export const getDecodedPayloadsForV1 = (binary) => {
    const entries = getProtobufFields(binary);
    const fixedId = entries.find(entry => entry.wireType === ProtobufWireTypes.Binary)?.id;
    if (!fixedId) {
        throw new Error('DEFUSER_PAYLOAD_DETAILS_V1_DATA_EMPTY');
    }
    const components = [];
    for (const entry of entries) {
        if (entry.id !== fixedId) {
            continue;
        }
        if (entry.wireType !== ProtobufWireTypes.Binary) {
            throw new Error('DEFUSER_PAYLOAD_DETAILS_V1_ENTRY_NOT_REPEATED');
        }
        const fields = getProtobufFields(entry.value);
        const data = getProtobufMap(PayloadV1FieldNames, fields);
        if (data.type?.wireType !== ProtobufWireTypes.Uint32) {
            continue;
        }
        switch (data.type.value) {
            case PayloadV1Types.Head: {
                if (data.head?.wireType !== ProtobufWireTypes.Binary) {
                    throw new Error('DEFUSER_PAYLOAD_DETAILS_V1_HEAD_NOT_VALID');
                }
                const node = getProtobufMap(PayloadV1HeadFieldNames, getProtobufFields(data.head.value));
                if (node.code?.wireType !== ProtobufWireTypes.Binary) {
                    throw new Error('DEFUSER_PAYLOAD_DETAILS_V1_HEAD_CODE_NOT_VALID');
                }
                const code = node.code.value.toString();
                components.push({
                    type: data.type.value,
                    code,
                });
                break;
            }
            case PayloadV1Types.Text: {
                if (data.text?.wireType !== ProtobufWireTypes.Binary) {
                    throw new Error('DEFUSER_PAYLOAD_DETAILS_V1_TEXT_NOT_VALID');
                }
                const node = getProtobufMap(PayloadV1TextFieldNames, getProtobufFields(data.text.value));
                if (node.id?.wireType !== ProtobufWireTypes.Binary) {
                    throw new Error('DEFUSER_PAYLOAD_DETAILS_V1_TEXT_ID_NOT_VALID');
                }
                if (node.text?.wireType !== ProtobufWireTypes.Binary) {
                    throw new Error('DEFUSER_PAYLOAD_DETAILS_V1_TEXT_CONTENT_NOT_VALID');
                }
                components.push({
                    type: data.type.value,
                    id: node.id.value.toString(),
                    text: node.text.value.toString(),
                });
                break;
            }
            default: {
                console.warn('DEFUSER_PAYLOAD_DETAILS_V1_UNKNOWN', fields);
                break;
            }
        }
    }
    return components;
};
export const getDecodedPayloads = (binary) => {
    const meta = getProtobufMap(PayloadFieldNames, getProtobufFields(binary));
    if (meta.version?.wireType !== ProtobufWireTypes.Uint32) {
        throw new Error('DEFUSER_UNEXPECTED_PAYLOAD_VERSION');
    }
    switch (meta.version.value) {
        case 1:
            {
                if (meta.details?.wireType !== ProtobufWireTypes.Binary) {
                    throw new Error('DEFUSER_UNEXPECTED_PAYLOAD_DETAILS_V1_TYPE');
                }
                return {
                    meta,
                    details: getDecodedPayloadsForV1(meta.details.value),
                };
            }
        default:
            {
                throw new Error('DEFUSER_PAYLOAD_VERSION_UNSUPPORTED');
            }
    }
};
export const decode = (binary, init) => {
    if (typeof init === 'string') {
        const keySources = getKeySources(init);
        const dictionarySources = getDictionarySources(init);
        init = {
            keySources,
            dictionarySources,
        };
    }
    // Key
    const [keyType, aPayload] = getMessageParts(binary);
    if (!init.keySources[keyType]) {
        throw new Error('DEFUSER_KEY_TYPE_NOT_SUPPORTED');
    }
    const keyStore = getKeyStore(init.keySources[keyType]);
    const aDecoded = getDecodedBinaryWithKeyStore(keyStore, aPayload);
    // Dictionary
    const [dictionaryType, bPayload] = getMessageParts(aDecoded);
    if (!init.dictionarySources[dictionaryType]) {
        throw new Error('DEFUSER_DICTIONARY_TYPE_NOT_SUPPORTED');
    }
    const dictionaryStore = getDictionaryStore(init.dictionarySources[dictionaryType]);
    const bDecoded = getDecodedBinaryWithDictionaryStore(dictionaryStore, bPayload);
    const payload = getDecodedPayloads(bDecoded);
    return payload;
};
//# sourceMappingURL=shortwave.js.map