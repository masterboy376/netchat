import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export const MainContext = React.createContext()

export const MainContextProvider = ({ children }) => {

    const firebaseConfig = {
        apiKey: "AIzaSyBXT9xEgYWdIk3Mto-HrT1-KXCiW89v7PE",
        authDomain: "netchat-862e4.firebaseapp.com",
        projectId: "netchat-862e4",
        storageBucket: "netchat-862e4.appspot.com",
        messagingSenderId: "641704404198",
        appId: "1:641704404198:web:de5e2713f0ffec9a114727",
        measurementId: "G-EV781M6FB1"
    };
    if (firebaseConfig?.projectId) {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        if (app.name && typeof window !== 'undefined') {
            const analytics = getAnalytics(app);
            console.log(analytics)
        }
    }
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [isDark, setIsDark] = useState(true)

    //----------------------------------------------------------------------------------------
    // sign up
    const signup = (email, password) => {
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            setUser(auth.currentUser);
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    const signin = (email, password) => {
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            setUser(auth.currentUser);
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    const logout = () => {
        signOut(auth).then(() => {
            setUser(null)
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    const reset = (e) => {
        sendPasswordResetEmail(auth, cred.email).then(() => {
            // Password reset email sent!
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    return (
        <MainContext.Provider value={{
            isDark,
            setIsDark,
            router
        }}>
            {children}
        </MainContext.Provider>
    )
}