import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {getFirestore} from "firebase/firestore";

const appConfig = {
    apiKey: "AIzaSyCi3RSwhUhhAAipSJ3ka5j6M_kyPuK17ZQ",
    authDomain: "yamungumobileapp.firebaseapp.com",
    projectId: "yamungumobileapp",
    storageBucket: "yamungumobileapp.appspot.com",
    messagingSenderId: "139816501373",
    appId: "1:139816501373:web:6521d066e608dd90207114",
    measurementId: "G-D4SW7BNC0M"
}

export const app =initializeApp(appConfig);
export const auth =getAuth(app);
export const db =getFirestore(app)
export const storage =getStorage(app)
export const staffCol ="STAFF"
export const ASSETS_COL ="ASSETS"
export const SALES_COL ="SALES"
export const SALES_STASTICS_COL ="SALES_STATISTICS"