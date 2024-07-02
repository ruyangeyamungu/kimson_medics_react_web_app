import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {getFirestore} from "firebase/firestore";

const appConfig = {
    apiKey: "AIzaSyAdXidjM6oH_10M6o1OBVpcI2tao67IGQ0",
    authDomain: "kimsonmedics2.firebaseapp.com",
    projectId: "kimsonmedics2",
    storageBucket: "kimsonmedics2.appspot.com",
    messagingSenderId: "199706873533",
    appId: "1:199706873533:web:81bc78aeb3ca663b8531d4",
    measurementId: "G-FFM87HB8XS"
}

export const app =initializeApp(appConfig);
export const auth =getAuth(app);
export const db =getFirestore(app)
export const storage =getStorage(app)
export const staffCol ="STAFF"
export const ASSETS_COL ="ASSETS"
export const SALES_COL ="SALES"
export const SALES_STASTICS_COL ="SALES_STATISTICS"