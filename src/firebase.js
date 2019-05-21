import firebase from 'firebase/app';
import "firebase/app";
import "firebase/database";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDY-BhcOSHDwgwNJ-rciIfJky-ZdM83MlM",
    authDomain: "mlcatie-emotion-chatapp.firebaseapp.com",
    databaseURL: "https://mlcatie-emotion-chatapp.firebaseio.com",
    projectId: "mlcatie-emotion-chatapp",
    storageBucket: "mlcatie-emotion-chatapp.appspot.com",
    messagingSenderId: "585665701008",
    appId: "1:585665701008:web:fbf1f63a3b750a18"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;