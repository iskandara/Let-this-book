// Admin sign-in. An account counts as an admin only if Firestore has a document admins/{uid}
// for it; firestore.rules checks the same thing before allowing a delete.
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { app, db } from './firebase.js';

const auth = getAuth(app);

// Calls back with null (signed out) or { email, uid, isAdmin }.
export function watchAdmin(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) return callback(null);
    let isAdmin = false;
    try {
      isAdmin = (await getDoc(doc(db, 'admins', user.uid))).exists();
    } catch {
      // Rules refuse the read for anyone who is not this admin, so treat errors as "not an admin".
    }
    callback({ email: user.email, uid: user.uid, isAdmin });
  });
}

export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signOutAdmin() {
  return signOut(auth);
}
