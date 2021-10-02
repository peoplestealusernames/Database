import { request } from "https"
import { readFileSync } from "fs"
import { connect } from 'net'
import { Connection } from "./ConnectionClass"
import { DataHandler, DataManger, Request } from "./DMClass"

const Path = JSON.parse(readFileSync('./Pass/HostName.json', 'utf-8'))

start()
async function start() {
    GetSocket()
}

function GetIP(): Promise<{ port: number, ip: string }> {
    return new Promise((resolve, rej) => {
        const req = request(Path, { method: 'GET' }, res => {
            res.on('data', (data: any) => {
                resolve(JSON.parse(data))
            })
        })

        req.on('error', error => {
            rej(error)
        })

        req.end()
    })
}

function GetSocket() {
    return new Promise(async (resolve, rej) => {
        const HostAdress = await GetIP()
        const socket = connect({ port: HostAdress.port, host: HostAdress.ip })
        //TODO:Rework
        const Server = new Connection(socket)

        Server.on('data', (data) => DataRec(data, Server))
        Server.on('setup', () => { Server.write(JSON.stringify(Send as Object)); resolve(Server) })

        socket.on('error', rej)
    })
}

/////////////////////////
//END OF CLIENT REC
//START OF CLIENT HANDLING
/////////////////////////

/*const Send: Request = {
    method: 'PUT',
    path: 'test',
    data: 'Aye',
    save: true
}*/

const Send: Request = {
    method: 'GET',
    path: 'test'
}

const DM = new DataManger()

function DataRec(data: string | object, Client: Connection) {
    console.log(data)
    if (data === 'PING') {
        Client.write('PONG')
    }

    DataHandler(data, Client, DM)
}
