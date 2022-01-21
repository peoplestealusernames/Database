import { EventEmitter } from 'events'
import { connect } from 'net'
import { Connection } from './ConnectionClass'
import { Request } from './RequestClass';

interface ClientEvents {
    'data': (data: object | string) => void;
    'setup': () => void
    'error': (err: Error) => void
    'close': (error: boolean) => void
    'timeout': () => void
}

export declare interface Client {
    on<U extends keyof ClientEvents>(
        event: U, listener: ClientEvents[U]
    ): this;

    emit<U extends keyof ClientEvents>(
        event: U, ...args: Parameters<ClientEvents[U]>
    ): boolean;
}

export class Client extends EventEmitter {
    private Server: Connection;
    private Listeners: EventEmitter = new EventEmitter;

    public constructor(host: string, port: number) {
        super()

        const socket = connect({ port, host })
        //TODO:Retry
        this.Server = new Connection(socket)
        this.Server.on('setup', () => { this.emit('setup') })


        this.Server.on('error', (data) => this.emit('error', data))
        this.Server.on('close', (data) => this.emit('close', data))
        this.Server.on('timeout', () => this.emit('timeout'));
        this.Server.on('data', this.PacketHandler.bind(this))
    }

    public put(path: string, data: any) {
        //TODO :err handling
        const Send = new Request('PUT', path, data)
        this.Server.write(JSON.stringify(Send));
    }

    public get(path: string): Promise<object | string> {
        //TODO: error handling
        //TODO: dont fetch if listeners are active instead grab value
        const Send = new Request('GET', path)
        this.Server.write(JSON.stringify(Send))

        return new Promise(async (resolve, rej) => {
            this.Listeners.once(path, resolve)
        })
    }

    public listen(path: string, CallBack: () => void) {
        //TODO: unlistener function
        //TODO: dont resend listen packet
        //TODO: send unlisten when no more listeners are on
        //TODO: save var to mem and send it instead of fetching it

        const Send = new Request('LISTEN', path)
        this.Server.write(JSON.stringify(Send));
        this.Listeners.on(path, CallBack)
    }

    private PacketHandler(data: string | object) {
        if (data != null && typeof (data) == 'object') {
            if (data.hasOwnProperty('method') && data.hasOwnProperty('path')) {
                const Req = data as Request

                switch (Req.method) {
                    case "PUT":
                        this.Listeners.emit(Req.path, Req.data)
                        break;
                }
                //TODO: rest of methods
                //TODO: something for get and listen requests
                return
            }
        }

        this.emit('data', data)
    }
}