import { request } from "https"
import { readFileSync } from "fs"
import { connect } from 'net'
import { GenKeys, Encrypt, Decrypt } from './crypto'
import { createPublicKey } from "crypto"
import { Connection } from "./ConnectionClass"

const Path = JSON.parse(readFileSync('./Pass/HostName.json', 'utf-8'))

var publicKey: string, privateKey: string

start()
async function start() {
    const Keys = await GenKeys()
    publicKey = Keys.publicKey
    privateKey = Keys.privateKey
    GetSocket()
}

function GetSocket() {
    return new Promise(async (resolve, rej) => {
        const HostAdress = await GetIP()
        const socket = connect({ port: HostAdress.port, host: HostAdress.ip })
        //TODO:Rework
        const Server = new Connection(socket)

        Server.on('data', console.log)
        Server.on('setup', () => { resolve(Server) })

        socket.on('error', rej)
    })
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

