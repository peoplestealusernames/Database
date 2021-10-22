import { request } from "https"
import { readFileSync } from "fs"
import { connect } from 'net'
import { Connection } from "./ConnectionClass"

function GetIP(): Promise<{ port: number, ip: string }> {
    const Path = JSON.parse(readFileSync('./Pass/HostName.json', 'utf-8')) //TODO: to index

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
}//TODO: Port somewhere else (shard lib)

export function GetSocket(): Promise<Connection> {//TODO: add ip and adress in params
    return new Promise(async (resolve, rej) => {
        const HostAdress = await GetIP()
        const socket = connect({ port: HostAdress.port, host: HostAdress.ip })
        //TODO:Retry

        const Server = new Connection(socket)

        Server.on('setup', () => { resolve(Server) })

        socket.on('error', rej)//TODO: err handling
    })
}
