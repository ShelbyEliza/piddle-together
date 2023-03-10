import { useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

// firebase imports:
import { doc, collection, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch, user } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    // sign the user out
    try {
      // before signout - update online status
      // only the user can update their own info while logged in
      const { uid } = user;

      let collRef = collection(db, "users");
      let userDoc = doc(collRef, uid);
      await updateDoc(userDoc, { online: false });

      await signOut(auth).then(() => {
        // dispatch logout action
        dispatch({ type: "LOGOUT" });
      });

      // update state
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      } else {
        setIsPending(false);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
      if (err) {
        setError(err.message);
        setIsPending(false);
        console.log(err);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { logout, error, isPending };
};
