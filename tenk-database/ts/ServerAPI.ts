import { Socket } from 'net'
import { listen } from './ListenAPI' //TODO: ServerAPI
import { Connection } from "./ConnectionClass"
import { EventEmitter } from 'events'
import { env } from 'process'

interface ServerEvents {
    'data': (data: object | string) => void
    'setup': () => void //TODO: error and closed
    'client': (Client: Connection) => void
}

export declare interface Server {
    on<U extends keyof ServerEvents>(
        event: U, listener: ServerEvents[U]
    ): this;

    emit<U extends keyof ServerEvents>(
        event: U, ...args: Parameters<ServerEvents[U]>
    ): boolean;
}

export class Server extends EventEmitter {
    public ip?: string
    public port?: number
    public Setup: boolean = false //TODO: await UntilSetup()

    public constructor(ip = "0.0.0.0", port?: number) {//THIS IS NOT FINIAL AWAIT SETUP EVENT
        //TODO : setup callback
        //TODO: non selfTCP varient for port forwarding
        super()

        this.ip = ip
        this.port = port
        if (!this.port)
            if (env.PORT) {
                this.port = parseInt(env.PORT)
            } else {
                throw new Error("No 'port' enviorment variable. and no port arg.")
            }

        listen(this.ip, this.port, this.NewSocket.bind(this))

    }

    private NewSocket(socket: Socket) {
        //@ts-ignore
        console.log('New connection ' + socket.remoteAddress + ":" + socket.remotePort.toString())
        const Client = new Connection(socket)
        this.emit('client', Client)
    }
}