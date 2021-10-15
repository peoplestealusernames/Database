"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSocket = void 0;
const https_1 = require("https");
const fs_1 = require("fs");
const net_1 = require("net");
const ConnectionClass_1 = require("./ConnectionClass");
function GetIP() {
    const Path = JSON.parse((0, fs_1.readFileSync)('./Pass/HostName.json', 'utf-8')); //TODO: to index
    return new Promise((resolve, rej) => {
        const req = (0, https_1.request)(Path, { method: 'GET' }, res => {
            res.on('data', (data) => {
                resolve(JSON.parse(data));
            });
        });
        req.on('error', error => {
            rej(error);
        });
        req.end();
    });
} //TODO: Port somewhere else (shard lib)
function GetSocket() {
    return new Promise((resolve, rej) => __awaiter(this, void 0, void 0, function* () {
        const HostAdress = yield GetIP();
        const socket = (0, net_1.connect)({ port: HostAdress.port, host: HostAdress.ip });
        //TODO:Retry
        const Server = new ConnectionClass_1.Connection(socket);
        Server.on('setup', () => { resolve(Server); });
        socket.on('error', rej); //TODO: err handling
    }));
}
exports.GetSocket = GetSocket;
