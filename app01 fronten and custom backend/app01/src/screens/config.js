import Firebase from 'firebase';
let config = {
  apiKey: "AIzaSyCfTKJiFQJG6-jEP9RNLNpEsYKvmc_Ed-g",
  authDomain: "app01-9a39b.firebaseapp.com",
  databaseURL: "https://app01-9a39b.firebaseio.com",
  projectId: "app01-9a39b",
  storageBucket: "app01-9a39b.appspot.com",
  messagingSenderId: "665629759853",
  appId: "1:665629759853:web:864d922b91f0e0d4c82264",
  measurementId: "G-PZ1JRGPXTG"
};
let app = Firebase.initializeApp(config);
export const db = app.database();