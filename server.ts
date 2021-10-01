import { Socket } from 'net'
import { SelfTCP } from './selfTCP'
import { UpdateIP, LogIn } from './FBPut'

var ip: string
var port: number
var selfSocket: Socket

start()
async function start() {
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

    socket.on('data', function (data) {
        console.log(data.toString());
    });

    socket.on('error', (err: any) => { console.log(err) })
}
