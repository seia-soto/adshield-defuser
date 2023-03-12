# AdShield Defuser

AdShield Defuser is a library that decodes AdShield inlined payloads to restore components. It can be used on browser extensions, user scripts, web drivers, and anywhere JavaScript runs.

## Status

The major version of AdShield Defuser will change when there are breaking changes.

- **v0** Mar 13, 2023

## Usage

We export every function and variable so that you can use it yourself.

### v0

> **Warning**: Currently, we only support decoding text nodes.

We provide a `getDecoded` function to extract all data. You can provide an `init` object as the AdShield script to extract both `keySources` and `dictionarySources` at runtime.

However, when working in a performance-critical environment, you can inline the cached version of both `keySources` and `dictionarySources`.

```ts
export type Init = {
	keySources: ReturnType<typeof getKeySources>;
	dictionarySources: ReturnType<typeof getDictionarySources>;
};

export const getDecoded: (binary: string, init: Init | string) => {
    meta: Partial<Record<"version" | "details", ProtobufField>>;
    details: PayloadV1Component[];
}
```
