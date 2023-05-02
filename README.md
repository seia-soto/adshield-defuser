# AdShield Defuser

AdShield Defuser is a library that decodes AdShield inlined payloads to restore components.
It can be used on browser extensions, user scripts, web drivers, node, and anywhere JavaScript runs.

----

# Status

The major version of AdShield Defuser will change when there are breaking changes.

- **v0** Mar 13, 2023
  - **basera1n** (deprecated)
  - **shortwave**
- **v0.0.10** May 2, 2023
  - **baseshower**

## v0

### Basera1n (DEPRECATED)

> The basera1n is declared as deprecated in May 2023.

We provide a simple function that is possible to decode base64-encoded utf8 script data into JSON compatible string.

```ts
export declare const decode: (init: string) => string;
```

### Shortwave

We provide a `getDecoded` function to extract all data from protobuf based script data.
You can provide an `init` object as the AdShield script to extract both `keySources` and `dictionarySources` at runtime.

However, when working in a performance-critical environment, you can inline the cached version of both `keySources` and `dictionarySources`.

```ts
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
```

We support decoding the following types:

```typescript
export enum PayloadV1Types {
	Head = 0,
	Text = 2,
}
```

### Baseshower

Another variant of basera1n.

```typescript
export type Tag = {
    tags: string;
};
export type Text = {
    text_id: string;
    text_value: string;
};
export type Payload = Tag | Text;
export declare const isTag: (payload: Payload) => payload is Tag;
export declare const isText: (payload: Payload) => payload is Text;
export declare const decode: (binary: string) => ({
    tags: string;
} | {
    text_id: string;
    text_value: string;
})[];
```

## Trivialities

Some notes for developers.

### Cross-platform API

You should install `Buffer` ponyfill or polyfill for your runtime if required.
We use `npm:buffer` in our implementation, but never included in the box.

See next section: Cross-platform API support on Browser APIs for more information.

### Cross-platform API support on Browser APIs

AdShield uses browser based APIs which behavior of the functions cannot be reproduced on other JavaScript runtimes.
We implement the browser APIs in Node.JS standard functions to be cross-platform compatible and performant.

Here's the list of browser function conversion in Node API:

**atob**

Decodes base64 string into ascii or binary*.

```typescript
const binary: string;

Buffer.from(binary, 'base64').toString('binary');
```

* In most cases, we should convert into binary format to support Korean properly.

**escape**

Escapes special character, but couldn't find the exact behavior in any RFCs.

It's safe to use `UInt8Array` instead of `Buffer` in strings.
Also, browsers support it out of box.

```typescript
const buffer: Buffer | UInt8Array;

const decoder = new TextDecoder();
const out = decoder.decode(buffer);
```

**Array.prototype.map**, **Array.prototype.forEach**

Avoid using `.map` or `.forEach` functional expressions for the performance critical environments.
We encourage you to use `for-of` expression in most environments.

However, you'll get the best performance when using `for IL` expression if you're using legacy Node.JS versions which is under v14.
See the following snippet for more information:

```typescript
const arr: string[];

for (let i = 0, l = arr.length; i < l; i++) {
  arr[i]; // do something
}
```
