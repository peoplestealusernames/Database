import { Server, Connection, DataHandler, DataManger } from 'tenk-database/ts/index'
import { connect } from 'net';
import { LogIn, UpdateIP } from './FBPut';

var Ser: Server

start()
async function start() {
    await LogIn()

    const iptest = connect({ port: 80, host: "google.com" }, async () => {
        const ip = iptest.localAddress
        const port = iptest.localPort

        console.log('Public ip: ', ip, port)
        UpdateIP(ip, port)

        Ser = new Server(ip, port) //TODO: TESTMODE ONLY
        Ser.on('client', (Client: Connection) => {
            Client.on('data', (data: any) => { DataRec(data, Client) })
            Client.on('error', console.log)
        })
    });
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