import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD_jYpta8sR1jg4zHbnF4eAOriVgCaaxzM",
    authDomain: "chatapp-8a77f.firebaseapp.com",
    databaseURL: "https://chatapp-8a77f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chatapp-8a77f",
    storageBucket: "chatapp-8a77f.appspot.com",
    messagingSenderId: "176020957032",
    appId: "1:176020957032:web:f87ed9b0ef7bae5fb7d8dd"
  };

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default db;