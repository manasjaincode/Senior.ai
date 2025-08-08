// Import the functions needed from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Replace these with your actual configuration details from the Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyCH65HqeIBQuGXEHCkg42Pt9ijExyPO1xM",
  authDomain: "senior-ai.firebaseapp.com",
  projectId: "senior-ai",
  storageBucket: "senior-ai.firebasestorage.app",
  messagingSenderId: "673245528567",
  appId: "1:673245528567:web:e5aae347c4bc3b81d22ef2",
  measurementId: "G-NZBF5KD25C"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase services and export them
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Export the services so they can be used in other files
export { auth, provider, db };
