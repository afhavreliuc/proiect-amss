const firebase = require('firebase/app');
require('firebase/firestore'); // Pentru Firestore

const firebaseConfig = {
    apiKey: "AIzaSyDFszAG9rKrj7gnqNsPhQ_o3ly3GyEu2vw",
    authDomain: "proiect-react-6e4d1.firebaseapp.com",
    projectId: "proiect-react-6e4d1",
    storageBucket: "proiect-react-6e4d1.appspot.com",
    messagingSenderId: "691708026176",
    appId: "1:691708026176:web:dc50b62d1bfc09bc456ea5",
};

// Inițializează Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

module.exports = { db, firebase };
