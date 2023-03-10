import { useState } from "react";
import { auth, db } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

// firebase imports:
import { collection, doc, updateDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

export const useLogin = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        dispatch({ type: "LOGIN", payload: res.user });
        return res;
      })
      .then((res) => {
        let ref = collection(db, "users");
        let refDoc = doc(ref, res.user.uid);
        updateDoc(refDoc, { online: true });
      })
      .then(() => {
        // CLEAN UP: Might not work
        setIsPending(false);
      })
      .catch((err) => {
        setIsPending(false);
        setError(err.message);
      });
  };
  const sendVerificationEmail = () => {
    setError(null);
    setIsPending(true);

    sendEmailVerification(auth.currentUser).then(() => {
      // email verification sent
      // redirect to temp page until email is verified
      setIsPending(false);

      return "Message sent! Please check your email to verify your account!";
    });
  };

  return { login, sendVerificationEmail, isPending, error };
};
