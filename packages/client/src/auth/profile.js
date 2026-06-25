import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";

function providerOf(user) {
  if (user.isAnonymous) return "guest";
  return user.providerData?.[0]?.providerId || "password";
}

// Creates the user's Firestore profile if it does not exist, and always
// refreshes lastLoginAt. Called after every successful sign-in.
export async function upsertUserProfile(user, extra = {}) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  const base = {
    uid: user.uid,
    email: user.email || null,
    displayName: user.displayName || extra.displayName || null,
    photoURL: user.photoURL || null,
    provider: providerOf(user),
    isAnonymous: user.isAnonymous,
    lastLoginAt: serverTimestamp(),
  };

  if (!snap.exists()) {
    await setDoc(ref, { ...base, createdAt: serverTimestamp() });
  } else {
    await setDoc(ref, base, { merge: true });
  }

  return ref;
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function deleteUserProfile(uid) {
  await deleteDoc(doc(db, "users", uid));
}
