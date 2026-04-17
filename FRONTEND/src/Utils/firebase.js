import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: "interviewqai.firebaseapp.com",
        projectId: "interviewqai",
        storageBucket: "interviewqai.firebasestorage.app",
        messagingSenderId: "534017524163",
        appId: "1:534017524163:web:5a73563ce82faae295fd76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };