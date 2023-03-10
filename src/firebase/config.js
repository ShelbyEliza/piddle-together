import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCMvAExsxBKCNaVaxbc_aDTaUp9-_Z5fH4",
  authDomain: "piddletogether.firebaseapp.com",
  projectId: "piddletogether",
  storageBucket: "piddletogether.appspot.com",
  messagingSenderId: "863572980550",
  appId: "1:863572980550:web:abb276d10aaee34beeab47",
  siteKey: "6LemVe4kAAAAABWo9zZ4pbxsV39fnkBgjKh8pCju",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(firebaseConfig.siteKey),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true,
});

// init service
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

export { db, auth, storage };
