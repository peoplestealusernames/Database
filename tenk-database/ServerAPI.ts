import { Socket } from 'net'
import { SelfTCP, listen } from './selfTCP' //TODO: ServerAPI
//import { UpdateIP, LogIn } from './FBPut' //TODO: ServerAPI with arg
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
    private selfSocket?: Socket //TODO: Auto reconnector to keep port alive
    public ip?: string
    public port?: number
    public Setup: boolean = false //TODO: await UntilSetup()

    public constructor(NatPunch = true, port?: number, ip = "0.0.0.0") {//THIS IS NOT FINIAL AWAIT SETUP EVENT
        //TODO : setup callback
        //TODO: non selfTCP varient for port forwarding
        super()
        if (NatPunch) {
            this.NatPunch()
        } else {
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
    }

    private async NatPunch() {
        this.selfSocket = await SelfTCP(this.NewSocket.bind(this))
        //TODO: double check I'm 50% sure this will break
        this.ip = this.selfSocket.localAddress
        this.port = this.selfSocket.localPort
    }

    private NewSocket(socket: Socket) {
        //@ts-ignore
        console.log('New connection ' + socket.remoteAddress + ":" + socket.remotePort.toString())
        const Client = new Connection(socket)
        this.emit('client', Client)
    }
}