/// <reference types="node" />
import { Socket } from 'net';
export declare function SelfTCP(OnConnect: (socket: Socket) => void): Promise<Socket>;
export declare function listen(ip: string, port: number, OnConnect: (socket: Socket) => void): Promise<unknown>;
