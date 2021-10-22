/// <reference types="node" />
import { Connection } from "./ConnectionClass";
import { EventEmitter } from 'events';
interface ServerEvents {
    'data': (data: object | string) => void;
    'setup': () => void;
    'client': (Client: Connection) => void;
}
export declare interface Server {
    on<U extends keyof ServerEvents>(event: U, listener: ServerEvents[U]): this;
    emit<U extends keyof ServerEvents>(event: U, ...args: Parameters<ServerEvents[U]>): boolean;
}
export declare class Server extends EventEmitter {
    private selfSocket?;
    ip?: string;
    port?: number;
    Setup: boolean;
    constructor(NatPunch?: boolean, port?: number, ip?: string);
    private NatPunch;
    private NewSocket;
}
export {};
