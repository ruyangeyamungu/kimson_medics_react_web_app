import { doc, updateDoc } from "firebase/firestore";
import { db } from "../App";


export async function update_field(colName, docID, data) {
    const docRef =doc(db, colName, docID)
    await updateDoc(docRef, data)
}