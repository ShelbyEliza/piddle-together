import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCMvAExsxBKCNaVaxbc_aDTaUp9-_Z5fH4",
  authDomain: "piddletogether.firebaseapp.com",
  projectId: "piddletogether",
  storageBucket: "piddletogether.appspot.com",
  messagingSenderId: "863572980550",
  appId: "1:863572980550:web:abb276d10aaee34beeab47",
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init services
const db = firebase.firestore();
const auth = firebase.auth();
const projectStorage = firebase.storage();

// timestamp
const timestamp = firebase.firestore.Timestamp;

export { db, auth, projectStorage, timestamp };
