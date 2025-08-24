// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmvHmB_GR1CL1QdN7ZiPMu8GD3QZGvl6s",
  authDomain: "hilberts-hotel.firebaseapp.com",
  projectId: "hilberts-hotel",
  storageBucket: "hilberts-hotel.firebasestorage.app",
  messagingSenderId: "408836342676",
  appId: "1:408836342676:web:e2d23759a12949b7dfc581",
  measurementId: "G-B4YJV0NWM8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
