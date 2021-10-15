/// <reference types="node" />
import { EventEmitter } from 'events';
import { Connection } from './ConnectionClass';
export declare class DataManger extends EventEmitter {
    private Data;
    private FileLocation?;
    constructor(Path?: string);
    Get(Path: string, ReqOut: boolean): any;
    Put(Path: string, Val: any, Save?: boolean): void;
    HandleReq(Req: Request, Client: Connection): void;
    private StringToIndex;
    private TableToIndex;
    private UpdateFile;
}
export declare class Request {
    path: string;
    method: 'GET' | 'PUT' | 'LISTEN';
    data?: any;
    save?: boolean;
    constructor(method: 'GET' | 'PUT' | 'LISTEN', path: string, data?: any, save?: boolean);
}
export declare function DataHandler(data: string | object, Client: Connection, DM: DataManger): void;
