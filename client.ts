import { request } from "https"
import { readFileSync } from "fs"
import { connect } from 'net'

const Path = JSON.parse(readFileSync('./Pass/HostName.json', 'utf-8'))

GetSocket()

function GetSocket() {
    return new Promise(async (resolve, rej) => {
        const HostAdress = await GetIP()
        const socket = connect({ port: HostAdress.port, host: HostAdress.ip }, () => {
            resolve(socket)
        })

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

