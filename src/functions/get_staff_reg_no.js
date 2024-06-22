import { db, staffCol } from "../App";
import { query, where, collection, getDocs } from "firebase/firestore";

export async function getStaffRegNo  (accountID) {

    const staffCollection= collection(db, staffCol);
    const q = query(staffCollection, where("accountID", "==", accountID));

    let x="";
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((staff) => {
        x = staff.id
    });

    return x

}