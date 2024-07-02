import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, staffCol, auth } from '../App';
import { useNavigate } from 'react-router-dom';
const useUserDeletionListener = () => {

  const [user] = useAuthState(auth);
  const navigate =useNavigate()

  useEffect(() => {
    if (!user) return;

    const staffDocRef = doc(db, staffCol, user.uid);

    const unsubscribe = onSnapshot(staffDocRef, (docSnapshot) => {
      if (!docSnapshot.exists()) {
        
        signOut(auth)
          .then(() => {
            console.log('User signed out because their document was deleted.');
            // Optionally, redirect to login page or show a message
           navigate('/verfyID')
          })
          .catch((error) => {
            console.error('Error signing out: ', error);
          });
      }
    });

    return () => unsubscribe();
  }, [user, auth, db]);
};

export default useUserDeletionListener;
