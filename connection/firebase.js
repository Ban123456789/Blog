var firebase = require('firebase');
require('dotenv').config();

var firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASEURL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGE,
    appId: process.env.FIREBASE_APPID,
    measurementId: process.env.FIRBASE_MEASUREMENTID
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

module.exports = firebase;