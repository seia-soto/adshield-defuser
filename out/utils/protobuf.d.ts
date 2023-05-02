/// <reference types="node" />
import protobufjs from 'protobufjs/minimal.js';
export declare enum ProtobufWireTypes {
    Nested = -1,
    Uint32 = 0,
    Uint64 = 1,
    Binary = 2,
    Float = 5
}
export type ProtobufField = {
    id: number;
    wireType: ProtobufWireTypes.Uint32;
    value: number;
} | {
    id: number;
    wireType: ProtobufWireTypes.Uint64;
    value: protobufjs.Long;
} | {
    id: number;
    wireType: ProtobufWireTypes.Binary;
    value: Buffer;
} | {
    id: number;
    wireType: ProtobufWireTypes.Float;
    value: number;
};
export declare const getProtobufFields: (buffer: Buffer) => ProtobufField[];
export declare const getProtobufMap: <FieldMap extends Record<string, string | number>>(names: FieldMap, fields: ProtobufField[]) => Partial<Record<keyof FieldMap, ProtobufField>>;
//# sourceMappingURL=protobuf.d.ts.map