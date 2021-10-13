import { Socket } from 'net'
import { SelfTCP } from '../selfTCP' //TODO: ServerAPI
import { UpdateIP, LogIn } from './FBPut' //TODO: ServerAPI with arg
import { Connection, DataHandler, DataManger } from '../index'

var ip: string
var port: number
var selfSocket: Socket

start()
async function start() {
    await LogIn()
    SelfTCP(NewSocket)
}

function NewSocket(socket: Socket) {
    //TODO: Move to server API
    if (!selfSocket) {
        selfSocket = socket
        //@ts-ignore
        ip = socket.localAddress
        //@ts-ignore
        port = socket.localPort
        UpdateIP(ip, port)
    }

    console.log('New connection ' + socket.remoteAddress + ":" + socket.remotePort?.toString())

    const Client = new Connection(socket)
    Client.on('data', (data) => { DataRec(data, Client) });

    socket.on('error', (err: any) => { console.log(err) })
}

/////////////////////////
//END OF CLIENT REC
//START OF CLIENT HANDLING
/////////////////////////

const DM = new DataManger('./Pass/ServerData.json')

function DataRec(data: string | object, Client: Connection) {
    console.log(data)
    if (data === 'PING') {
        Client.write('PONG')
    }

    DataHandler(data, Client, DM)
}