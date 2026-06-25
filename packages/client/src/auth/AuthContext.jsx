import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase.js";
import { upsertUserProfile, deleteUserProfile } from "./profile.js";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsub;
  }, []);

  const register = useCallback(async ({ email, password, displayName }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await sendEmailVerification(cred.user);
    await upsertUserProfile(cred.user, { displayName });
    setUser({ ...cred.user });
    return cred.user;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await upsertUserProfile(cred.user);
    return cred.user;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    await upsertUserProfile(cred.user);
    return cred.user;
  }, []);

  const loginWithApple = useCallback(async () => {
    const provider = new OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");
    const cred = await signInWithPopup(auth, provider);
    await upsertUserProfile(cred.user);
    return cred.user;
  }, []);

  const loginAsGuest = useCallback(async () => {
    const cred = await signInAnonymously(auth);
    await upsertUserProfile(cred.user);
    return cred.user;
  }, []);

  const resetPassword = useCallback((email) => sendPasswordResetEmail(auth, email), []);

  const resendVerification = useCallback(async () => {
    if (auth.currentUser) await sendEmailVerification(auth.currentUser);
  }, []);

  const reloadUser = useCallback(async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    const current = auth.currentUser;
    if (!current) return;
    await deleteUserProfile(current.uid);
    await deleteUser(current);
  }, []);

  const logout = useCallback(() => signOut(auth), []);

  const value = {
    user,
    initializing,
    register,
    login,
    loginWithGoogle,
    loginWithApple,
    loginAsGuest,
    resetPassword,
    resendVerification,
    reloadUser,
    deleteAccount,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
