import { connect } from "net"
import { DataHandler, DataManger, Request, Connection } from "tenk-database"

const socket = connect({ port: 8000, host: "Server" }, start)
async function start() {
    //TODO:Retry
    const Server = new Connection(socket)

    Server.on('setup', () => { Server.write(JSON.stringify(Send)); console.log("Setup") })

    //socket.on('error', console.log)//TODO: err handling
    Server.on('data', (msg) => DataRec(msg, Server))
    console.log("Setup and connected")
}

/*const Send: Request = {
    method: 'PUT',
    path: 'test',
    data: 'Aye',
    save: true
}*/
//const Send = {    method: 'PUT',    path: 'test',    data: 'Aye',    save: true}
//const Send = {    method: 'GET',    path: 'test',    data: 'Aye',    save: true}

//const Send: Request = new Request('PUT', 'test', 'lets go')
//const Send: Request = new Request('PUT', 'RGB', { r: 255, g: 255, b: 255 }, true)
var Send = new Request('LISTEN', 'RGB')

const DM = new DataManger('./Pass/ClientData.json') //TODO: to index

function DataRec(data: string | object, Client: Connection) {
    console.log(data)
    if (data === 'PING') {
        Client.write('PONG')
    }

    DataHandler(data, Client, DM)
}
