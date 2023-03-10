import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, storage, db } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

// firebase imports:
import { doc, setDoc, collection } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const useSignup = () => {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null);
    setIsPending(true);
    console.log("1. starting of signup");

    // CLEAN UP: confused about updating docs!
    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        console.log("2. creating a user document");
        if (!res) {
          throw new Error("Could not complete signup");
        } else {
          console.log("3. user has been created");
          return res;
        }
      })
      .then((res) => {
        console.log("4. updating user profile with displayName");
        if (auth.currentUser !== null) {
          updateProfile(auth.currentUser, {
            displayName: displayName,
          });
        } else {
          console.log("Error! no user signed in");
          return;
        }
        console.log(res);
        return res;
      })
      .then((res) => {
        console.log("5. uploading thumbnail");
        const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
        const img = ref(storage, uploadPath);
        uploadBytes(img, thumbnail)
          .then(() => {
            console.log("11. thumbnail uploaded");
            let imgUrl = getDownloadURL(img);
            console.log("12. thumbnail url retrieved");
            return imgUrl;
          })
          .then((imgUrl) => {
            console.log("13. updating user profile with photoUrl");
            updateProfile(res.user, {
              photoURL: imgUrl,
            });
            return imgUrl;
          })
          .then((imgUrl) => {
            console.log(
              "14. new user profile displayName and image properties have been updated"
            );
            let ref = collection(db, "users");
            let docRef = doc(ref, res.user.uid);
            console.log("15. creating a document for user");
            setDoc(docRef, {
              online: true,
              displayName: displayName,
              photoURL: imgUrl,
            });
          });
        console.log("6. user document has been created");
        return res;
      })
      .then((res) => {
        setIsPending(false);
        return res;
      })
      .then((res) => {
        console.log("7. setting logged in context for user");
        dispatch({ type: "LOGIN", payload: res.user });
        console.log("8. logged in context has been set for user");
      })
      .then(() => {
        console.log("9. sending verification email");
        sendEmailVerification(auth.currentUser).then(() => {
          console.log("16. redirecting to login page");
          navigate("/login");
        });
        console.log("10. verification email sent");
      })
      .catch((err) => {
        setError(err.message);
        setIsPending(false);
      });
  };

  return { signup, error, isPending };
};
