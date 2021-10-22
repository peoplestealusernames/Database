import { Server, Connection, DataHandler, DataManger } from 'tenk-database/index'

var Ser: Server

start()
async function start() {
    Ser = new Server(false, 8000) //TODO: TESTMODE ONLY
    Ser.on('client', (Client: Connection) => {
        Client.on('data', (data: any) => { DataRec(data, Client) })
        Client.on('error', console.log)
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