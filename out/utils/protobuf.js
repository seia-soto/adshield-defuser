import protobufjs from 'protobufjs/minimal.js';
export var ProtobufWireTypes;
(function (ProtobufWireTypes) {
    // The internal type will have negative integer as the value
    ProtobufWireTypes[ProtobufWireTypes["Nested"] = -1] = "Nested";
    ProtobufWireTypes[ProtobufWireTypes["Uint32"] = 0] = "Uint32";
    ProtobufWireTypes[ProtobufWireTypes["Uint64"] = 1] = "Uint64";
    ProtobufWireTypes[ProtobufWireTypes["Binary"] = 2] = "Binary";
    ProtobufWireTypes[ProtobufWireTypes["Float"] = 5] = "Float";
})(ProtobufWireTypes || (ProtobufWireTypes = {}));
// https://github.com/konsumer/rawproto/blob/master/package.json
export const getProtobufFields = (buffer) => {
    const reader = protobufjs.Reader.create(buffer);
    const out = [];
    while (reader.pos < reader.len) {
        const tag = reader.uint64();
        // @ts-expect-error Tag is calculatable here
        const id = tag >>> 3;
        // @ts-expect-error Tag is calculatable here
        const wireType = tag & 7;
        switch (wireType) {
            case ProtobufWireTypes.Uint32: // Int32, int64, uint32, bool, enum, etc
                out.push({ id, wireType, value: reader.uint32() });
                break;
            case ProtobufWireTypes.Uint64: // Fixed64, sfixed64, double
                out.push({ id, wireType, value: reader.fixed64() });
                break;
            case ProtobufWireTypes.Binary: // String, bytes, sub-message
                out.push({ id, wireType, value: Buffer.from(reader.bytes()) });
                break;
            case ProtobufWireTypes.Float: // Fixed32, sfixed32, float
                out.push({ id, wireType, value: reader.float() });
                break;
            default: reader.skipType(wireType);
        }
    }
    return out;
};
// The following type is used to express compiled `enum` which is not constant in JavaScript
// Also see https://github.com/microsoft/TypeScript/issues/30611#issuecomment-479087883
export const getProtobufMap = (names, fields) => {
    const out = {};
    for (const field of fields) {
        const name = names[field.id.toString()];
        if (name) {
            out[name] = field;
        }
    }
    return out;
};
//# sourceMappingURL=protobuf.js.map