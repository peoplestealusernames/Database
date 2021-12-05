import { DataManger } from "tenk-database/ts";

const DM = new DataManger('./ServerData')
DM.Put("Test", { a: true })
console.log(DM.Get("Test/a"))

/*
import { connect } from "net";
import dgram from 'dgram';

const server = dgram.createSocket('udp4');

const Test = server.connect(19302, "stun.l.google.com", () => { console.log("Aye") })
server.on('data', console.log)
server.on('error', console.log)
*/