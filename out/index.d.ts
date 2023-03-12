/// <reference types="node" />
import protobufjs from 'protobufjs';
export declare const getMessageParts: (binary: string) => readonly [string, string];
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
export declare const getKeySources: (script: string) => Record<string, Buffer>;
export declare enum KeyStoreFieldNames {
    id = 1,
    version = 2,
    details = 10
}
export declare enum KeyStoreDetailsFieldNames {
    input = 1,
    output = 2,
    reserved = 3,
    reservedInput = 4,
    reservedOutput = 5
}
export declare const getKeyStore: (keySource: Buffer) => {
    details: {
        id: number;
        wireType: ProtobufWireTypes;
        value: Partial<Record<"input" | "output" | "reserved" | "reservedInput" | "reservedOutput", ProtobufField>>;
    };
    id?: ProtobufField | undefined;
    version?: ProtobufField | undefined;
};
export declare const getDeterminedChar: (a: string, b: string, c: string) => string;
export declare const getDecodedBinaryWithKeyStore: (keyStore: ReturnType<typeof getKeyStore>, binary: string) => string;
export declare const getDictionarySources: (script: string) => Record<string, string>;
export declare const getDictionaryStore: (source: string) => {
    reserved: number[];
    dictionary: string[];
};
export declare const getDecodedBinaryWithDictionaryStore: (dictionaryStore: ReturnType<typeof getDictionaryStore>, binary: string) => Buffer;
export declare enum PayloadFieldNames {
    version = 1,
    details = 10
}
export type PayloadV1Component = {
    type: PayloadV1Types.Text;
    id: string;
    text: string;
};
export declare enum PayloadV1Types {
    Text = 2
}
export declare enum PayloadV1FieldNames {
    type = 1,
    text = 12
}
export declare enum PayloadV1TextFieldNames {
    id = 1,
    text = 2
}
export declare const getDecodedPayloadsForV1: (binary: Buffer) => PayloadV1Component[];
export declare const getDecodedPayloads: (binary: Buffer) => {
    meta: Partial<Record<"version" | "details", ProtobufField>>;
    details: PayloadV1Component[];
};
export type Init = {
    keySources: ReturnType<typeof getKeySources>;
    dictionarySources: ReturnType<typeof getDictionarySources>;
};
export declare const getDecoded: (binary: string, init: Init | string) => {
    meta: Partial<Record<"version" | "details", ProtobufField>>;
    details: PayloadV1Component[];
};
//# sourceMappingURL=index.d.ts.map