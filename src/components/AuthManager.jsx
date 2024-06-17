// src/components/AuthManager.jsx
import { useState, useEffect } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { app } from "../firebase"; // Import the Firebase app configuration

// Initialize Firebase Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const AuthManager = ({ setUser }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    // Monitor authentication state
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setUser(user);
    });
    return unsubscribeAuth;
  }, [setUser]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="auth-container">
      {!authUser ? (
        <button onClick={handleSignIn} className="sign-in-button">
          <img
            src="../../public/google-sign-in.png"
            alt="Google sign in"
            className="sign-in-img"
          />
        </button>
      ) : (
        <header className="sign-in-header">
          <p>Welcome, {authUser.displayName}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </header>
      )}
    </div>
  );
};

export default AuthManager;
