# AdShield Defuser

AdShield Defuser is a library that decodes AdShield inlined payloads to restore components. It can be used on browser extensions, user scripts, web drivers, and anywhere JavaScript runs.

## Status

The major version of AdShield Defuser will change when there are breaking changes.

- **v0** Mar 13, 2023
  - **basera1n**
  - **shortwave**

## v0

### Shortwave

> **Warning**: Currently, we only support decoding text nodes.

We provide a `getDecoded` function to extract all data from protobuf based script data.
You can provide an `init` object as the AdShield script to extract both `keySources` and `dictionarySources` at runtime.

However, when working in a performance-critical environment, you can inline the cached version of both `keySources` and `dictionarySources`.

```ts
export type Init = {
    keySources: ReturnType<typeof getKeySources>;
    dictionarySources: ReturnType<typeof getDictionarySources>;
};
export declare const getDecoded: (binary: string, init: Init | string) => {
    meta: Partial<Record<"version" | "details", ProtobufField>>;
    details: PayloadV1Component[];
};
```

### Basera1n

We provide a simple function that is possible to decode base64-encoded utf8 script data into JSON compatible string.

```ts
export declare const decode: (init: string) => string;
```
