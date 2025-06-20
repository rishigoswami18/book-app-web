// Import required Firebase SDKs
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCGwNvDmuRoTslXUSF5VO9cuOne_D_wVo",
  authDomain: "book-app-ad46f.firebaseapp.com",
  databaseURL: "https://book-app-ad46f-default-rtdb.firebaseio.com",
  projectId: "book-app-ad46f",
  storageBucket: "book-app-ad46f.appspot.com",
  messagingSenderId: "547825569000",
  appId: "1:547825569000:web:636580a5d38d127bca4d5d",
  measurementId: "G-CR6DNJJN3X"
};

// ✅ Initialize app FIRST
const app = initializeApp(firebaseConfig);

// ✅ THEN export everything else using this 'app'
export const database = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
