"use strict";
//65535
//String.fromCharCode(65535).charCodeAt(0)
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decrypt = exports.Encrypt = exports.GenKeysSync = void 0;
const MaxChar = 55000;
//Buffer has conversion error around 55000-60000 alhough 60000+ is good
function GenKeysSync(keyLength = 100) {
    var Key = "";
    for (let i = 0; i < keyLength; i++) {
        Key += String.fromCharCode(Math.random() * MaxChar);
    }
    return {
        publicKey: Key,
        privateKey: Key
    };
}
exports.GenKeysSync = GenKeysSync;
function Encrypt(publicKey, Text) {
    var Ret = "";
    for (let i = 0; i < Text.length; i++) {
        let shift = i % publicKey.length;
        let N = Text.charCodeAt(i) + publicKey.charCodeAt(shift);
        N = N % MaxChar + MaxChar * +(N < 0);
        Ret += String.fromCharCode(N);
    }
    return Ret;
}
exports.Encrypt = Encrypt;
function Decrypt(privateKey, Data) {
    var Text = Data.toString();
    var Ret = "";
    for (let i = 0; i < Text.length; i++) {
        let shift = i % privateKey.length;
        let N = Text.charCodeAt(i) - privateKey.charCodeAt(shift);
        N = N % MaxChar + MaxChar * +(N < 0);
        Ret += String.fromCharCode(N);
    }
    return Ret;
}
exports.Decrypt = Decrypt;
