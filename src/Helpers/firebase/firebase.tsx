// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2GubFoYxAPOuYBmCj_OI1uSMoPe4SjuI",
  authDomain: "dar-seranity.firebaseapp.com",
  projectId: "dar-seranity",
  storageBucket: "dar-seranity.appspot.com",
  messagingSenderId: "532708167383",
  appId: "1:532708167383:web:f15e3f8d67fec52c5faa92",
  measurementId: "G-RK8WP15CFH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
