import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBrNBFYXNLyrkr5wWhioEsYi3vJVh5f_OM",
    authDomain: "cloudcomptest-e86ae.firebaseapp.com",
    projectId: "cloudcomptest-e86ae",
    storageBucket: "cloudcomptest-e86ae.appspot.com",
    messagingSenderId: "1074388374614",
    appId: "1:1074388374614:web:aa48d1f3597d090d5217f7"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  

const storage = firebase.storage();

export { storage, firebase as default };