//65535
//String.fromCharCode(65535).charCodeAt(0)

import { Encrypt, GenKeysSync, Decrypt } from "./crypto";

/*
for (let i = 0; i < 50000; i++) {
    let A = String.fromCharCode(i)
    let B = Buffer.from(A)
    let C = B.toString()
    if (A !== C)
        console.log(i, A, C)
}*/

/*let a = "abcdef"
for (let i = 0; i < 20; i++) {
    let shift = i % a.length
    console.log(a[shift], i)
}*/

/*let Text = ""
for (let i = 50000 - 1000; i < 50000; i++) {
    Text += String.fromCharCode(i)
}

const Keys = GenKeysSync()
const Msg = Encrypt(Keys.publicKey, Text)
const Rec = Decrypt(Keys.privateKey, Msg)
console.log(Text, '\n', Msg, '\n', Rec, '\n', Text === Rec)
*/

/*
let Text = ""
for (let i = 0; i < 55000; i++) {
    Text += String.fromCharCode(i)
}
for (let times = 1000; times > 0; times--) {
    const Keys = GenKeysSync()
    const Msg = Encrypt(Keys.publicKey, Text)
    const Rec = Decrypt(Keys.privateKey, Msg)
    if (Text !== Rec)
        console.log("err")
}
*/