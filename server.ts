import { Socket } from 'net'
import { SelfTCP } from './selfTCP'
import { UpdateIP, LogIn } from './FBPut'
import { GenKeys, Encrypt, Decrypt } from './crypto'
import { Connect } from './ConnectionClass'

var ip: string
var port: number
var selfSocket: Socket
var publicKey: string, privateKey: string

start()
async function start() {
    const Keys = await GenKeys()
    publicKey = Keys.publicKey
    privateKey = Keys.privateKey
    await LogIn()
    SelfTCP(NewSocket)
}

function NewSocket(socket: Socket) {
    if (!selfSocket) {
        selfSocket = socket
        //@ts-ignore
        ip = socket.localAddress
        //@ts-ignore
        port = socket.localPort
        UpdateIP(ip, port)
    }

    console.log('New connection ' + socket.remoteAddress + ":" + socket.remotePort?.toString())

    const Client = new Connect(socket)
    Client.on('data', (data) => {
        console.log(data)
        if (data == 'PING') {
            Client.write('PONG')
        }
    });

    socket.on('error', (err: any) => { console.log(err) })
}
