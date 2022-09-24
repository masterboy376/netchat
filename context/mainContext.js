import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, onAuthStateChanged, reauthenticateWithCredential, deleteUser, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore, doc, setDoc, deleteDoc, updateDoc, onSnapshot } from "firebase/firestore";
// import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getDatabase, ref, set, remove } from "firebase/database";
import { toast } from 'react-toastify';

export const MainContext = React.createContext()

export const MainContextProvider = ({ children }) => {

    const firebaseConfig = {
        apiKey: "AIzaSyBXT9xEgYWdIk3Mto-HrT1-KXCiW89v7PE",
        authDomain: "netchat-862e4.firebaseapp.com",
        projectId: "netchat-862e4",
        storageBucket: "netchat-862e4.appspot.com",
        messagingSenderId: "641704404198",
        appId: "1:641704404198:web:de5e2713f0ffec9a114727",
        measurementId: "G-EV781M6FB1",
        databaseURL: "https://netchat-862e4-default-rtdb.firebaseio.com/",
    };
    // if (firebaseConfig?.projectId) {
    const app = initializeApp(firebaseConfig);

    // if (app.name && typeof window !== 'undefined') {
    //     const analytics = getAnalytics(app);
    //     alertFailure(analytics)
    // }
    // }
    const auth = getAuth(app);
    const db = getFirestore(app);
    // const storage = getStorage(app);
    const database = getDatabase(app);

    // const storageRef = ref(storage)

    const router = useRouter()
    const [isDark, setIsDark] = useState(true)
    const [user, setUser] = useState(null)
    const [friends, setFriends] = useState(null)

    //----------------------------------------------------------------------------------------
    // useEffect
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
                setUser(null)
            }
        })
    }, []);

    //----------------------------------------------------------------------------------------
    // functions 
    const alertSuccess = (message) => toast.success(message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: { 'backgroundColor': `${isDark ? '#1f2937' : '#f1f5f9'}`, 'color': `${isDark ? 'white' : '#111827'}` }
    });
    const alertFailure = (message) => toast.error(message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: { 'backgroundColor': `${isDark ? '#1f2937' : '#f1f5f9'}`, 'color': `${isDark ? 'white' : '#111827'}` }
    });

    //----------------------------------------------------------------------------------------
    // functions

    // sign up
    const signUpRemember = ({ email, password, name, username }) => {
        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                    return createProfile(name, username, email, auth.currentUser.uid)
                }).catch((error) => {
                    alertFailure(`ErrorCode-${error.code}: ${error.message}`)
                });
            })
            .catch((error) => {
                alertFailure(`ErrorCode-${error.code}: ${error.message}`)
            });
    }

    // sign up
    const signUp = ({ email, password, name, username }) => {
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            return createProfile(name, username, email, auth.currentUser.uid)
        }).catch((error) => {
            alertFailure(`ErrorCode-${error.code}: ${error.message}`)
        });
    }

    // sign in remember
    const signInRemember = ({email, password}) => {
        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                return signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                    alertSuccess(`User signed in successfully!`)
                }).catch((error) => {
                    alertFailure(`ErrorCode-${error.code}: ${error.message}`)
                });
            })
            .catch((error) => {
                alertFailure(`ErrorCode-${error.code}: ${error.message}`)
            });
        }
        
        // sign in
        const signIn = ({email, password}) => {
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            alertSuccess(`User signed in successfully!`)
        }).catch((error) => {
            alertFailure(`ErrorCode-${error.code}: ${error.message}`)
        });
    }

    // log out
    const logout = () => {
        signOut(auth).then(() => {
            alertSuccess(`User logged out successfully!`)
        }).catch((error) => {
            alertFailure(`ErrorCode-${error.code}: ${error.message}`)
        });
    }

    // reset
    const reset = (e) => {
        sendPasswordResetEmail(auth, cred.email).then(() => {
            alertSuccess(`Reset email sent successfully!`)
        }).catch((error) => {
            alertFailure(`ErrorCode-${error.code}: ${error.message}`)
        });
    }

    // delete user
    const deleteAccount = (e) => {
        deleteUser(auth.currentUser).then(() => {
            alertSuccess(`User deleted successfully!`)
        }).catch((error) => {
            alertFailure(`ErrorCode-${error.code}: ${error.message}`)
        });
    }

    // re authenticate
    const reAuth = (e) => {
        reauthenticateWithCredential(user, credential).then(() => {
            alertSuccess(`Reauthentication successfully!`)
        }).catch((error) => {
            alertFailure(`ErrorCode-${error.code}: ${error.message}`)
        });
    }

    //----------------------------------------------------------------------------------------
    // send friend request
    const sendFriendRequest = (to) => {
        set(ref(database, 'requests/' + to + user.uid), Date.now()).then(() => {
            alertSuccess(`Friend request sent successfully!`)
        })
            .catch((error) => {
                alertFailure(`ErrorCode-${error.code}: ${error.message}`)
            });
    }

    // accept friend request
    const acceptFriendRequest = async (acceptedUserId) => {
        const friendListUpdate = {}
        friendListUpdate[`${acceptedUserId}`] = Date.now
        let docRef = await updateDoc(doc(db, "friends", user.uid), friendListUpdate);
        if (docRef !== null) {
            remove(ref(database, 'requests/' + to), user.uid).then(() => {
                alertSuccess(`Friend request accepted successfully!`)
            })
                .catch((error) => {
                    alertFailure(`ErrorCode-${error.code}: ${error.message}`)
                });
        }
    }

    // decline friend request
    const declineFriendRequest = (declinedUserId) => {
        remove(ref(database, 'requests/' + user.uid + declinedUserId)).then(() => {
            alertSuccess(`Friend request declined successfully!`)
        })
            .catch((error) => {
                alertFailure(`ErrorCode-${error.code}: ${error.message}`)
            });
    }

    // remove friend
    const removeFriend = async (userId, newData) => {
        await updateDoc(doc(db, "friends", userId), newData);
    }

    // get users friends
    const getUserFriends = (userId) => {
        const unsubscribe = onSnapshot(
            collection(db, "friends", userId),
            (snapshot) => {
                setFriends(snapshot.data())
            },
            (error) => {
                alertFailure(`ErrorCode-${error.code}: ${error.message}`)
            });
    }

    //----------------------------------------------------------------------------------------
    // create use profile
    const createProfile = async (name, username, email, userId) => {
        let docRef = await setDoc(doc(db, "users", userId), {
            name: name,
            username: username,
            email: email
        });
        docRef = await setDoc(doc(db, "freinds", userId), {});
    }

    //update user profile
    const updateProfile = async (userId, newData) => {
        await updateDoc(doc(db, "users", userId), newData);
    }

    //delete user profile
    const deleteProfile = async (userId) => {
        await deleteDoc(doc(db, "users", userId));
    }

    // get user details by userId
    const getUserDetails = (userId) => {
        const unsubscribe = onSnapshot(
            collection(db, "friends", userId),
            (snapshot) => {
                return snapshot.data()
            },
            (error) => {
                alertFailure(`ErrorCode-${error.code}: ${error.message}`)
            });
    }

    //----------------------------------------------------------------------------------------
    // const uploadFile = async (file, metadata)=>{
    //     constuploadBytes(storageRef, file, metadata);
    // }

    return (
        <MainContext.Provider value={{
            isDark,
            setIsDark,
            router,
            alertSuccess,
            alertFailure,
            signIn,
            signUp,
            signInRemember,
            signUpRemember,
            logout,
            createProfile,
            auth
        }}>
            {children}
        </MainContext.Provider>
    )
}