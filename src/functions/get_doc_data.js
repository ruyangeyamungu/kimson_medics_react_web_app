import { doc, getDoc } from "firebase/firestore";
import { db } from "../App";

export async function get_doc_data(colName, docID) {
    const docRef =doc(db, colName, docID)
    const docSnapShot = await getDoc(docRef)
    const docData =docSnapShot.data()
    return docData
 }