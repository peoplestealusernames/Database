import { Socket } from 'net'
import { SelfTCP } from './selfTCP' //TODO: ServerAPI
//import { UpdateIP, LogIn } from './FBPut' //TODO: ServerAPI with arg
import { Connection } from "./ConnectionClass"
import { EventEmitter } from 'events'

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
    private selfSocket?: Socket //TODO: Auto reconnector to keep port alive
    public ip?: string
    public port?: number
    public Setup: boolean = false //TODO: await UntilSetup()

    public constructor() {//THIS IS NOT FINIAL AWAIT SETUP EVENT
        //TODO : setup callback
        //TODO: non selfTCP varient for port forwarding
        super()
        SelfTCP(this.NewSocket.bind(this))
    }

    private NewSocket(socket: Socket) {
        if (!this.selfSocket) {
            this.selfSocket = socket
            //@ts-ignore
            this.ip = socket.localAddress
            //@ts-ignore
            this.port = socket.localPort

            //@ts-ignore
            console.log("Self connection from " + socket.remoteAddress + ":" + socket.remotePort.toString())

            this.Setup = true
            this.emit('setup')
        } else {
            //@ts-ignore
            console.log('New connection ' + socket.remoteAddress + ":" + socket.remotePort.toString())
            const Client = new Connection(socket)
            this.emit('client', Client)
        }
    }
}