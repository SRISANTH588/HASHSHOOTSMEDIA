// Firebase configuration for OG Shoots
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAtkcHfgNx9xEcyMC50eRX5VPv1r7O5XyE",
  authDomain: "hash-shoots.firebaseapp.com",
  projectId: "hash-shoots",
  storageBucket: "hash-shoots.firebasestorage.app",
  messagingSenderId: "1093054616221",
  appId: "1:1093054616221:web:55bdebafc895acfd04fa74"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

export { db, collection, addDoc, getDocs, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp };
