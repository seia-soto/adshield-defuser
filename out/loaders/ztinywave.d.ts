export type Data = Array<{
    tags: string;
}>;
export type KeyEntry = {
    id: string;
    input: string;
    output: string;
    reserved1: number;
    reserved1Input: string;
    reserved1Output: string;
    reserved2: number;
    reserved2Input: string;
    reserved2Output: string;
};
/**
 * The code below is highly un-optimized.
 */
export declare const getKeys__Node__: (source: string) => Promise<KeyEntry[]>;
export declare const decode: (payload: string, keyStore: KeyEntry[]) => Data;
//# sourceMappingURL=ztinywave.d.ts.map