# AdShield Defuser

AdShield Defuser is a library that decodes AdShield inlined payloads to restore components. It can be used on browser extensions, user scripts, web drivers, and anywhere JavaScript runs.

## Status

The major version of AdShield Defuser will change when there are breaking changes.

- **v0** Mar 13, 2023
  - **basera1n**
  - **shortwave**
- **v0.0.10** May 2, 2023
  - **baseshower**

## v0

### Basera1n

We provide a simple function that is possible to decode base64-encoded utf8 script data into JSON compatible string.

```ts
export declare const decode: (init: string) => string;
```

### Shortwave

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

We support decoding the following types:

```typescript
export enum PayloadV1Types {
	Head = 0,
	Text = 2,
}
```

### Baseshower

Another variant of basera1n.

```ts
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
