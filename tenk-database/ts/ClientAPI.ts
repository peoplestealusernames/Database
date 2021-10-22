import { request } from "https"
import { readFileSync } from "fs"
import { connect } from 'net'
import { Connection } from "./ConnectionClass"

function GetIP() {
    return JSON.parse(readFileSync('./Pass/HostName.json', 'utf-8')) //TODO: to index
}

export function GetSocket(): Promise<Connection> {//TODO: add ip and adress in params
    return new Promise(async (resolve, rej) => {
        const HostAdress = GetIP()
        const socket = connect({ port: HostAdress.port, host: HostAdress.ip })
        //TODO:Retry

        const Server = new Connection(socket)

        Server.on('setup', () => { resolve(Server) })

        socket.on('error', rej)//TODO: err handling
    })
}
