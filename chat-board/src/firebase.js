import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// ✅ Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_78mln70vb5cnT4n83Z4zyZH0xW74W_g",
  authDomain: "chat-board-87eb1.firebaseapp.com",
  projectId: "chat-board-87eb1",
  storageBucket: "chat-board-87eb1.appspot.com",
  messagingSenderId: "764544345269",
  appId: "1:764544345269:web:815f41e5e42841c0858afc",
  measurementId: "G-B3H551ELLR",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Firestore and Functions
export const db = getFirestore(app);
export const functions = getFunctions(app);

// ✅ Connect to local emulator only when running locally
if (window.location.hostname === "localhost") {
  console.log("⚡ Connecting Firebase Functions to local emulator...");
  connectFunctionsEmulator(functions, "localhost", 5002);
}