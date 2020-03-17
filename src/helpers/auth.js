import {firebaseAuth, googleProvider} from "../config/firebase-config";

// sign-in with Google
export function loginWithGoogle() {
    return firebaseAuth().signInWithRedirect(googleProvider);
}

// sign-out
export function logout() {
    return firebaseAuth().signOut();
}