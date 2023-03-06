import { createContext, useReducer, useEffect } from "react";
import { auth } from "../firebase/config";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  const checkIfVerified = (user) => {
    let isUserVerified = false;
    if (user !== null) {
      if (user.emailVerified) {
        isUserVerified = true;
      } else {
        isUserVerified = false;
      }
    } else {
      isUserVerified = false;
    }
    return isUserVerified;
  };

  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isUserVerified: checkIfVerified(action.payload),
      };
    case "LOGOUT":
      return { ...state, user: null, isUserVerified: false };
    case "AUTH_IS_READY":
      return {
        user: action.payload,
        authIsReady: true,
        isUserVerified: checkIfVerified(action.payload),
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
    isUserVerified: false,
  });

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      dispatch({ type: "AUTH_IS_READY", payload: user });
      unsub();
    });
  }, []);

  console.log("AuthContext state:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
