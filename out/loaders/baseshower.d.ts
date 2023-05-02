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
//# sourceMappingURL=baseshower.d.ts.map