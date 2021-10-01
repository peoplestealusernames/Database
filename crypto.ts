import { generateKeyPair, KeyObject, privateDecrypt, publicEncrypt } from "crypto";

generateKeyPair("rsa", {
    modulusLength: 1024
}, (err: any, publicKey: KeyObject, privateKey: KeyObject) => {
    if (err) { throw new Error(err) }
    var msg = "Test"
    var send = publicEncrypt(publicKey, Buffer.from(msg, "utf8"))
    console.log(publicKey)
    var rec = privateDecrypt(privateKey, send).toString()

    console.log(JSON.stringify({ msg, send: send.toString(), rec }))
});