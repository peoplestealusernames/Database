import { DataHandler, DataManger, Request, Connection, GetSocket } from "tenk-database"

start()
async function start() {
    const Server = await GetSocket()
    Server.write(JSON.stringify(Send))
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
const Send: Request = new Request('PUT', 'SleepScreen', false, true)

const DM = new DataManger('./Pass/ClientData.json') //TODO: to index

function DataRec(data: string | object, Client: Connection) {
    console.log(data)
    if (data === 'PING') {
        Client.write('PONG')
    }

    DataHandler(data, Client, DM)
}
