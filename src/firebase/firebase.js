import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQOYfauhAcIbOjkY0CbsBoNWe0BMH1BVg",
  authDomain: "skillverificationsystem.firebaseapp.com",
  projectId: "skillverificationsystem",
  storageBucket: "skillverificationsystem.appspot.com",
  messagingSenderId: "174190256786",
  appId: "1:174190256786:web:9bc98111530ab91db6fc4b"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore();
}

export const db = firebase.firestore();

export default firebase;
