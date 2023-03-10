import { useState, useEffect } from "react";
import { db } from "../firebase/config";

import { collection, doc, onSnapshot } from "firebase/firestore";

export const useDocument = (coll, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  // realtime data for document:
  useEffect(() => {
    let ref = collection(db, coll);
    let docRef = doc(ref, id);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.data()) {
          setDocument({ ...snapshot.data(), id: snapshot.id });
          setError(null);
        } else {
          setError("No such document exists.");
        }
      },
      (err) => {
        console.log(err.message);
        setError("Failed to get document.");
      }
    );

    return () => unsubscribe();
  }, [coll, id]);

  return { document, error };
};
