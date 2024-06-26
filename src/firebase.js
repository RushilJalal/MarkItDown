// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "react-notes-b057b.firebaseapp.com",
    projectId: "react-notes-b057b",
    storageBucket: "react-notes-b057b.appspot.com",
    messagingSenderId: "996560167131",
    appId: "1:996560167131:web:eae4bd2daa5b927f9f6cfe"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const notesCollection = collection(db, "notes")

import { GoogleAuthProvider } from "firebase/auth";

export const provider = new GoogleAuthProvider();