import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, onAuthStateChanged, reauthenticateWithCredential, deleteUser, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore, doc, setDoc, addDoc, deleteDoc, updateDoc, onSnapshot, arrayUnion, arrayRemove } from "firebase/firestore";
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
    const [isDark, setIsDark] = useState(false)
    const [friends, setFriends] = useState(null)
    const [isLeftBar, setIsLeftBar] = useState(false)
    const [isRightBar, setIsRightBar] = useState(false)

    //----------------------------------------------------------------------------------------
    // useEffect
    // useEffect(() => {
    //     if(!auth.currentUser){
    //       router.push('/signin')
    //     }
    //     else{
    //         router.push('/')
    //     }
    // }, [auth])
    // onAuthStateChanged(auth, (user) => {
    //     if (user) {
    //         router.push('/')
    //         // acceptFriendRequest('y0HJI8VwwhS9spppK7cbwy1nL022')
    //     } else {
    //         router.push('/signin')
    //     }
    // })
    // useEffect(() => {
    // }, []);
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

    // sign up
    const signUpRemember = ({ email, password, name, username }) => {
        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                    return createProfile(name, username, email, auth.currentUser.uid)
                }).catch((error) => {
                    alertFailure(`${error.message}`)
                });
            })
            .catch((error) => {
                alertFailure(`${error.message}`)
            });
    }

    // sign up
    const signUp = ({ email, password, name, username }) => {
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            return createProfile(name, username, email, auth.currentUser.uid)
        }).catch((error) => {
            alertFailure(`${error.message}`)
        });
    }

    // sign in remember
    const signInRemember = ({ email, password }) => {
        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                return signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                    router.push('/')
                    alertSuccess(`User signed in successfully!`)
                }).catch((error) => {
                    alertFailure(`${error.message}`)
                });
            })
            .catch((error) => {
                alertFailure(`${error.message}`)
            });
    }

    // sign in
    const signIn = ({ email, password }) => {
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
            router.push('/')
            alertSuccess(`User signed in successfully!`)
        }).catch((error) => {
            alertFailure(`${error.message}`)
        });
    }

    // log out
    const logout = () => {
        signOut(auth).then(() => {
            router.push('/signin')
            alertSuccess(`User logged out successfully!`)
        }).catch((error) => {
            alertFailure(`${error.message}`)
        });
    }

    // reset
    const reset = (e) => {
        sendPasswordResetEmail(auth, cred.email).then(() => {
            alertSuccess(`Reset email sent successfully!`)
        }).catch((error) => {
            alertFailure(`${error.message}`)
        });
    }

    // delete user
    const deleteAccount = (e) => {
        deleteUser(auth.currentUser).then(() => {
            alertSuccess(`User deleted successfully!`)
        }).catch((error) => {
            alertFailure(`${error.message}`)
        });
    }

    // re authenticate
    const reAuth = (e) => {
        reauthenticateWithCredential(auth.currentUser, credential).then(() => {
            alertSuccess(`Reauthentication successfully!`)
        }).catch((error) => {
            alertFailure(`${error.message}`)
        });
    }

    //----------------------------------------------------------------------------------------
    // send friend request
    const sendFriendRequest = async (userId, to) => {
        const docRef = await addDoc(collection(db, "requests"), {
            from: userId,
            to: to
        });
        if (docRef != null) {
            alertSuccess("Friend request sent successfully!")
        }
        else {
            alertSuccess("Failed to send friend request!")
        }
    }

    // accept friend request
    const acceptFriendRequest = async (requestId) => {
        let docRef = null;
        const requestRef = doc(db, "requests", requestId);
        const requestSnap = await getDoc(requestRef);
        docRef = await updateDoc(doc(db, "users", auth.currentUser.uid), {
            friends: arrayUnion(requestSnap.data().from)
        });
        docRef = await updateDoc(doc(db, "users", requestSnap.data().from), {
            friends: arrayUnion(auth.currentUser.uid)
        });
        if (docRef !== null) {
            docRef = await deleteDoc(requestRef);
            if (docRef !== null) {
                alertSuccess('Successfully accepted friend request!')
            }
            else {
                alertFailure(`Failed to accept friend request!`)
            }
        }
        else {
            alertFailure(`Failed to accept friend request!`)
        }
    }


    // decline friend request
    const declineFriendRequest = async (requestId) => {
        const requestRef = doc(db, "requests", requestId);
        let docRef = null;
        docRef = await deleteDoc(requestRef);
        if (docRef !== null) {
            alertSuccess('Successfully accepted friend request!')
        }
        else {
            alertFailure(`Failed to accept friend request!`)
        }
    }

    // remove friend
    const removeFriend = async (userId, removedFriendId) => {
        let docRef = null;
        docRef = await updateDoc(doc(db, "users", userId), {
            friends: arrayRemove(removedFriendId)
        });
        if (docRef != null) {
            alertSuccess(`Successfully removed the friend!`)
        }
        else {
            alertFailure(`Failed to remove the friend!`)
        }
    }

    // get users friends
    const getUserFriends = (userId) => {
        const unsubscribe = onSnapshot(
            collection(db, "friends", userId),
            (snapshot) => {
                setFriends(snapshot.data())
            },
            (error) => {
                alertFailure(`${error.message}`)
            });
    }

    //----------------------------------------------------------------------------------------
    // create use profile
    const createProfile = async (name, username, email, userId) => {
        let docRef = await setDoc(doc(db, "users", userId), {
            name: name,
            username: username,
            email: email,
            friends: []
        });
        if (docRef != null) {
            docRef = await setDoc(doc(db, "freinds", userId), null);
            if (docRef != null) {
                alertSuccess("Profile created successfully.")
            }
            else {
                alertFailure("Failed to create user profile.")
            }
        }
        else {
            alertFailure("Failed to create user profile.")
        }
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
                alertFailure(`${error.message}`)
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
            auth,
            isLeftBar,
            setIsLeftBar,
            isRightBar,
            setIsRightBar
        }}>
            {children}
        </MainContext.Provider>
    )
}