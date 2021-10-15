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
exports.SelfTCP = void 0;
const net_1 = require("net");
function SelfTCP(OnConnect) {
    return new Promise((res, rej) => {
        const iptest = (0, net_1.connect)({ port: 80, host: "google.com" }, () => __awaiter(this, void 0, void 0, function* () {
            const ip = iptest.localAddress;
            const port = iptest.localPort;
            //TODO: destroying ip test removes pub ip if you dont linux breaks
            //iptest.destroy()
            yield listen(ip, port, OnConnect); //For this to be "0.0.0.0" ip test needs to be destroyed
            const SelfTCP = (0, net_1.connect)({ port, host: ip }, () => {
                SelfTCP.off('error', rej);
                iptest.off('error', rej);
                res(SelfTCP);
                iptest.destroy();
                //destroying ip test here seems to keep pub ip
            });
            SelfTCP.on('error', rej);
        }));
        iptest.on('error', rej);
    });
}
exports.SelfTCP = SelfTCP;
function listen(ip, port, OnConnect) {
    return new Promise((res, rej) => {
        var server = (0, net_1.createServer)(OnConnect);
        server.listen(port, ip, function () {
            console.log('listening on ', ip + ":" + port);
            res(true);
        });
        server.on('error', (err) => {
            if (err.code === "EADDRINUSE") {
                console.log('Address in use retrying');
                setTimeout(() => {
                    server.close();
                    server.listen(port, ip);
                }, 1000);
            }
            else {
                rej(err);
            }
        });
    });
}
