/// <reference types="node" />
import { Socket } from 'net';
import { EventEmitter } from 'events';
interface ConnectionEvents {
    'data': (data: object | string) => void;
    'setup': () => void;
    'error': (err: Error) => void;
    'close': (error: boolean) => void;
}
export declare interface Connection {
    on<U extends keyof ConnectionEvents>(event: U, listener: ConnectionEvents[U]): this;
    emit<U extends keyof ConnectionEvents>(event: U, ...args: Parameters<ConnectionEvents[U]>): boolean;
}
export declare class Connection extends EventEmitter {
    socket: Socket;
    publicKey: string;
    privateKey: string;
    setup: boolean;
    remotePublicKey?: string;
    RecHandShake: boolean;
    Encrypted: boolean;
    Listens: {
        DM: EventEmitter;
        path: string;
    }[];
    constructor(socket: Socket);
    write(msg: string, CallBack?: (err?: Error) => void): void;
    CB(data: object | string): void;
}
export {};
