import { useEffect, useState, useRef } from "react";
import { db } from "../firebase/config";

// firebase imports:
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
} from "firebase/firestore";

export const useCollection = (coll, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  // if we don't use a ref --> infinite loop in useEffect
  // _query is an array and is "different" on every function call
  const q = useRef(_query).current;
  const orderedBy = useRef(_orderBy).current;

  useEffect(() => {
    let ref = collection(db, coll);

    if (q) {
      ref = query(where(ref, ...q));
    }
    if (orderedBy) {
      ref = orderBy(ref, ...orderedBy);
    }

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        // update state
        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError("could not fetch the data");
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, [coll, q, orderedBy]);

  return { documents, error };
};
