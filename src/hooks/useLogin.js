import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    console.log("start of login");
    setError(null);
    setIsPending(true);

    try {
      // login
      const res = await auth.signInWithEmailAndPassword(email, password);

      // update online status:
      await db.collection("users").doc(res.user.uid).update({ online: true });

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  const sendVerificationEmail = async () => {
    setError(null);
    setIsPending(true);
    try {
      await db.currentUser.sendEmailVerification();
      // email verification sent
      // redirect to temp page until email is verified
      return "Message sent! Please check your email to verify your account!";
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, sendVerificationEmail, isPending, error };
};
