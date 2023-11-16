// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3zz0OecViSbVSbKY6vUmdzhQYaKxIatM",
  authDomain: "formsvue.firebaseapp.com",
  projectId: "formsvue",
  storageBucket: "formsvue.appspot.com",
  messagingSenderId: "985659085722",
  appId: "1:985659085722:web:099a02fc0dc5a4be7ae023",
  measurementId: "G-XKN69PTQXK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// const preguntasRef = app.ref(database, 'preguntas');
// const respuestasRef = app.ref(database, 'respuestas');
export default database