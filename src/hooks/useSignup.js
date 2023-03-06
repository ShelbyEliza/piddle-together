import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, projectStorage, db } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const navigate = useNavigate();
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const updateThumbnail = async (res, thumbnail, displayName) => {
    // after user created with uid upload user avatar:
    const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
    const img = await projectStorage.ref(uploadPath).put(thumbnail);

    const imgUrl = await img.ref.getDownloadURL();

    await res.user.updateProfile({ displayName, photoURL: imgUrl });
    return imgUrl;
  };

  const signup = (email, password, displayName, thumbnail) => {
    setError(null);
    setIsPending(true);
    console.log("start of signup");

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        if (!res) {
          throw new Error("Could not complete signup");
        }
        console.log("creating a user document");
        console.log(res);
        db.collection("users")
          .doc(res.user.uid)
          .set({
            online: true,
            displayName: displayName,
            photoURL: updateThumbnail(res, thumbnail),
          });
        return res;
      })
      .then((res) => {
        if (isCancelled) {
          console.log("Hello");
          setIsPending(false);
          setError(null);
        }
        console.log("user document has been created");
      })
      .then((res) => {
        console.log("setting logged in context for user");
        dispatch({ type: "LOGIN", payload: res.user });
        console.log("logged in context has been set for user");
      })
      .then(() => {
        db.currentUser.sendEmailVerification();
        // email verification sent
        console.log("email verification sent");
        // redirect to login page until email is verified
        navigate("/login");
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err.message);
          setIsPending(false);
        }
      });
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { signup, error, isPending };
};
