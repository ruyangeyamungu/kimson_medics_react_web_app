import { db } from "../App";
import { getDoc,doc } from "firebase/firestore";

export async function check_existance(colName, docID) {
    const docRef = doc(db, colName, docID);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
}