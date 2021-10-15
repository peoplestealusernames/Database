/// <reference types="node" />
import { Socket } from 'net';
export declare function SelfTCP(OnConnect: (socket: Socket) => void): Promise<Socket>;
