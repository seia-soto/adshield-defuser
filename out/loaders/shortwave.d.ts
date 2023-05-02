/// <reference types="node" />
import { ProtobufWireTypes } from '../utils/protobuf.js';
export declare const getMessageParts: (binary: string) => readonly [string, string];
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
        value: Partial<Record<"input" | "output" | "reserved" | "reservedInput" | "reservedOutput", import("../utils/protobuf.js").ProtobufField>>;
    };
    id?: import("../utils/protobuf.js").ProtobufField | undefined;
    version?: import("../utils/protobuf.js").ProtobufField | undefined;
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
} | {
    type: PayloadV1Types.Head;
    code: string;
};
export declare enum PayloadV1Types {
    Head = 0,
    Text = 2
}
export declare enum PayloadV1FieldNames {
    type = 1,
    head = 10,
    text = 12
}
export declare enum PayloadV1HeadFieldNames {
    code = 1
}
export declare enum PayloadV1TextFieldNames {
    id = 1,
    text = 2
}
export declare const getDecodedPayloadsForV1: (binary: Buffer) => PayloadV1Component[];
export declare const getDecodedPayloads: (binary: Buffer) => {
    meta: Partial<Record<"version" | "details", import("../utils/protobuf.js").ProtobufField>>;
    details: PayloadV1Component[];
};
export type Init = {
    keySources: ReturnType<typeof getKeySources>;
    dictionarySources: ReturnType<typeof getDictionarySources>;
};
export declare const decode: (binary: string, init: Init | string) => {
    meta: Partial<Record<"version" | "details", import("../utils/protobuf.js").ProtobufField>>;
    details: PayloadV1Component[];
};
//# sourceMappingURL=shortwave.d.ts.map