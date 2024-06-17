// src/App.jsx
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import "./App.css";
import {
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { db, notesCollection } from "./firebase.js";
import AuthManager from "./components/AuthManager"; // Import AuthManager

export default function App() {
  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState("");
  const [tempNoteText, setTempNoteText] = useState("");
  const [user, setUser] = useState(null);

  const currentNote =
    notes.find((note) => {
      return note.id === currentNoteId;
    }) || notes[0];

  const sortedNotes = notes.sort((a, b) => {
    return b.updatedAt - a.updatedAt;
  });

  useEffect(() => {
    if (user) {
      // Query notes for the authenticated user
      const q = query(notesCollection, where("uid", "==", user.uid));
      const unsubscribeNotes = onSnapshot(q, function (snapshot) {
        const notesArr = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setNotes(notesArr);
      });
      return unsubscribeNotes;
    }
  }, [user]);

  useEffect(() => {
    if (!currentNoteId && notes.length > 0) {
      setCurrentNoteId(notes[0]?.id);
    }
  }, [currentNoteId, notes]);

  useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body);
    }
  }, [currentNote]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentNote && tempNoteText !== currentNote.body)
        updateNote(tempNoteText);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [tempNoteText]);

  async function createNewNote() {
    if (!user) return;

    const newNote = {
      uid: user.uid,
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id);
  }

  async function updateNote(text) {
    if (!currentNoteId) return;

    const docRef = doc(db, "notes", currentNoteId);
    await setDoc(
      docRef,
      { body: text, updatedAt: Date.now() },
      { merge: true }
    );
  }

  async function deleteNote(noteId) {
    const docRef = doc(db, "notes", noteId);
    await deleteDoc(docRef);
  }

  return (
    <main>
      <AuthManager setUser={setUser} />
      {user && (
        <div>
          {notes.length > 0 ? (
            <Split sizes={[30, 70]} direction="horizontal" className="split">
              <Sidebar
                notes={sortedNotes}
                currentNote={currentNote}
                setCurrentNoteId={setCurrentNoteId}
                newNote={createNewNote}
                deleteNote={deleteNote}
              />
              <Editor
                tempNoteText={tempNoteText}
                setTempNoteText={setTempNoteText}
              />
            </Split>
          ) : (
            <div className="no-notes">
              <h1>You have no notes</h1>
              <button className="first-note" onClick={createNewNote}>
                Create one now
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}