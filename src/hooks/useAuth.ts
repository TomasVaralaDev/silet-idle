import { useState, useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase";

/**
 * useAuth Hook
 * Manages the Firebase authentication state listener.
 * Provides the current logged-in user and a loading boolean to prevent
 * premature rendering of protected routes before Firebase resolves the session.
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // Set up Firebase Auth state observer
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, loadingAuth };
};
