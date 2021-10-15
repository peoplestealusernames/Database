import { initializeApp } from "firebase/app";
import { DatabaseReference, getDatabase, ref, set } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { readFileSync } from "fs"

const firebaseConfig = JSON.parse(readFileSync('./Pass/FB.json', 'utf-8')) //TODO: move to index
const Account = JSON.parse(readFileSync('./Pass/login.json', 'utf-8')) //TODO: move to index

const app = initializeApp(firebaseConfig);
const auth = getAuth();

var loggedIn = false
var db, DBRef: DatabaseReference, user

export function LogIn() {
    return new Promise((res, rej) => {
        signInWithEmailAndPassword(auth, Account.email, Account.pass)
            .then((userCredential) => {
                // Signed in 
                user = userCredential.user;
                db = getDatabase(app);
                DBRef = ref(db, 'host')
                loggedIn = true
                res(true)
                console.log('logged in')
            })
            .catch((error) => {
                rej(error)
            });
    })
}

//Actual FNC

export function UpdateIP(ip: string, port: number) {
    if (!loggedIn) throw new Error("not logged in")
    set(DBRef, {
        ip, port
    });
}