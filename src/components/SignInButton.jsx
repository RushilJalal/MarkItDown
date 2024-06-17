// src/components/SignInButton.jsx
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const SignInButton = () => {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
};

export default SignInButton;
