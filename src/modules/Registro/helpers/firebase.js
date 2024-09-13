import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA7IX7eXKPu-sZnuv6-3A_6QxD1nBtWbCM",
  authDomain: "tesisatletismo-5bb09.firebaseapp.com",
  projectId: "tesisatletismo-5bb09",
  storageBucket: "tesisatletismo-5bb09.appspot.com",
  messagingSenderId: "243610299498",
  appId: "1:243610299498:web:fe44f9af333f35e6f32e13"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


const storage = firebase.storage();

export { storage, firebase as default };