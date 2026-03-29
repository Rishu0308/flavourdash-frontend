// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "flavor-dash-food-deliver-38c64.firebaseapp.com",
  projectId: "flavor-dash-food-deliver-38c64",
  storageBucket: "flavor-dash-food-deliver-38c64.firebasestorage.app",
  messagingSenderId: "975061500841",
  appId: "1:975061500841:web:31512d8dc0996762423ab8"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export {app, auth}