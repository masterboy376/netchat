import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, onAuthStateChanged, reauthenticateWithCredential, deleteUser, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore, doc, setDoc, addDoc, deleteDoc, updateDoc, onSnapshot, arrayUnion, arrayRemove, getDoc, collection } from "firebase/firestore";
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
    const [friends, setFriends] = useState(null)
    const [isLeftBar, setIsLeftBar] = useState(false)
    const [isRightBar, setIsRightBar] = useState(false)

    //----------------------------------------------------------------------------------------
    // useEffect
    // useEffect(() => {
    //     if(auth.currentUser){
    //         getUserFriends(auth.currentUser.uid)
    //     }
    // }, [auth]);
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
        try {
            const docRef = await addDoc(collection(db, "requests"), {
                from: userId,
                to: to
            });
            alertSuccess("Friend request sent successfully!")
        } catch (e) {
            alertSuccess("Failed to send friend request!")
        }
    }

    // accept friend request
    const acceptFriendRequest = async (userId, requestId) => {
        try {
            const requestRef = doc(db, "requests", requestId);
            const requestSnap = await getDoc(requestRef);
            let docRef = await updateDoc(doc(db, "users", userId), {
                friends: arrayUnion(requestSnap.data().from)
            });
            docRef = await updateDoc(doc(db, "users", requestSnap.data().from), {
                friends: arrayUnion(userId)
            });
            docRef = await deleteDoc(requestRef);
            alertSuccess('Successfully accepted friend request!')
        }
        catch (e) {
            alertFailure(`Failed to accept friend request!`)
        }
    }

    // decline friend request
    const declineFriendRequest = async (requestId) => {
        try {
            const requestRef = doc(db, "requests", requestId);
            let docRef = null;
            docRef = await deleteDoc(requestRef);
            alertSuccess('Successfully accepted friend request!')
        }
        catch (e) {
            alertFailure(`Failed to accept friend request!`)
        }
    }

    // remove friend
    const removeFriend = async (userId, removedFriendId) => {
        try {
            let docRef = docRef = await updateDoc(doc(db, "users", userId), {
                friends: arrayRemove(removedFriendId)
            });
            alertSuccess(`Successfully removed the friend!`)
        } catch (error) {
            alertFailure(`Failed to remove the friend!`)
        }
    }

    // get users friends
    const getUserFriends = (userId) => {
        let friendRef = onSnapshot(
            doc(db, "users", userId),
            (userFriends) => {
                let arr = []
                userFriends.data().friends.forEach(element => {
                    let userRef = onSnapshot(
                        doc(db, "users", element),
                        (userDetails) => {
                            arr.push(userDetails.data())
                        },
                        (error) => {
                            alertFailure(`${error.message}`)
                        })
                });
                setFriends(arr)
            },
            (error) => {
                alertFailure(`${error.message}`)
            });
    }

    //----------------------------------------------------------------------------------------
    // create use profile
    const createProfile = async (name, username, email, userId) => {
        try {
            let docRef = await setDoc(doc(db, "users", userId), {
                name: name,
                username: username,
                email: email,
                friends: []
            });
            alertSuccess("Profile created successfully.")
        }
        catch (e) {
            alertFailure("Failed to create user profile .")
        }
    }

    //update user profile
    const updateProfile = async (userId, newData) => {
        try {
            await updateDoc(doc(db, "users", userId), newData);
            alertSuccess("Profile updated successfully.")
        } catch (e) {
            alertFailure("Failed to update user profile.")
        }
    }

    //delete user profile
    const deleteProfile = async (userId) => {
        try {
            await deleteDoc(doc(db, "users", userId));
            alertSuccess('Profile deleted successfully!')
        }
        catch (e) {
            alertFailure('Failed to delete the profile!')
        }
    }

    // get user details by userId
    const getUserDetails = (userId) => {
        const unsubscribe = onSnapshot(
            doc(db, "users", userId),
            (snapshot) => {
                console.log(snapshot.data())
                return snapshot.data()
            },
            (error) => {
                alertFailure(`${error.message}`)
            })
    }

    //----------------------------------------------------------------------------------------
    // const uploadFile = async (file, metadata)=>{
    //     constuploadBytes(storageRef, file, metadata);
    // }

    return (
        <MainContext.Provider value={{
            friends,
            setFriends,
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
            setIsRightBar,
            onAuthStateChanged,
            sendFriendRequest,
            acceptFriendRequest,
            getUserFriends,
            getUserDetails
        }}>
            {children}
        </MainContext.Provider>
    )
}