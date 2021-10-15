/// <reference types="node" />
export declare function GenKeysSync(keyLength?: number): {
    publicKey: string;
    privateKey: string;
};
export declare function Encrypt(publicKey: string, Text: string): String;
export declare function Decrypt(privateKey: string, Data: NodeJS.ArrayBufferView | string): string;
