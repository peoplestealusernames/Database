import { UpdateIP, LogIn } from './FBPut'
import { Server, Connection, DataHandler, DataManger } from 'tenk-database/index'

var Ser: Server

start()
async function start() {
    await LogIn()
    Ser = new Server()
    Ser.on('client', (Client: Connection) => {
        Client.on('data', (data: any) => { DataRec(data, Client) })
        Client.on('error', console.log)
    })

    Ser.on('setup', () => {
        if (Ser.ip && Ser.port) {
            UpdateIP(Ser.ip, Ser.port)
            console.log("Updated ip")
        } else console.log("Setup but could not post")
    })
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