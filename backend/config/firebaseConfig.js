const firebase = require('firebase/app');
require('firebase/firestore'); // Pentru Firestore

const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id",
};

// Inițializează Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

module.exports = { db, firebase };
