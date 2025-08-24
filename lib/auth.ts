import { auth, googleProvider } from "./firebase"
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signInWithPopup,
	signOut,
	onAuthStateChanged as firebaseOnAuthStateChanged,
	updateProfile,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
} from "firebase/auth"

export function onAuthStateChanged(callback: Parameters<typeof firebaseOnAuthStateChanged>[1]) {
	return firebaseOnAuthStateChanged(auth, callback)
}

export async function signInWithEmail(email: string, password: string) {
	const cred = await signInWithEmailAndPassword(auth, email, password)
	return cred.user
}

export async function signUpWithEmail(name: string, email: string, password: string) {
	const cred = await createUserWithEmailAndPassword(auth, email, password)
	if (name) {
		await updateProfile(cred.user, { displayName: name })
	}
	return cred.user
}

export async function signInWithGoogle() {
	const cred = await signInWithPopup(auth, googleProvider)
	return cred.user
}

export async function signOutUser() {
	await signOut(auth)
}

export async function changePassword(currentEmail: string, currentPassword: string, newPassword: string) {
    if (!auth.currentUser) throw new Error("Not authenticated")
    // Re-authenticate with current credentials, then update password
    const credential = EmailAuthProvider.credential(currentEmail, currentPassword)
    await reauthenticateWithCredential(auth.currentUser, credential)
    await updatePassword(auth.currentUser, newPassword)
}


