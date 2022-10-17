import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, onAuthStateChanged, reauthenticateWithCredential, deleteUser, setPersistence, browserSessionPersistence } from "firebase/auth"; 
import { getFirestore, doc, setDoc, addDoc, deleteDoc, updateDoc, onSnapshot, arrayUnion, arrayRemove, getDoc, collection, getDocs, where } from "firebase/firestore";
import { getDatabase, ref, set, query, push, onValue } from "firebase/database";
import { toast } from 'react-toastify';

export const MainContext = React.createContext()

export const MainContextProvider = ({ children }) => {

    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
        databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const database = getDatabase(app);
    // const storage = getStorage(app);

    const router = useRouter()
    const [isDark, setIsDark] = useState(true)
    const [user, setUser] = useState(null)
    const [friends, setFriends] = useState(null)
    const [requests, setRequests] = useState(null)
    const [isLeftBar, setIsLeftBar] = useState(false)
    const [isRightBar, setIsRightBar] = useState(false)
    const [messages, setMessages] = useState([])
    const [currentFriend, setCurrentFriend] = useState(null)
    const [addFriendModal, setAddFriendModal] = useState(false)
    const [friendRequestsModal, setFriendRequestsModal] = useState(false)
    const [userModal, setUserModal] = useState(false)

    //----------------------------------------------------------------------------------------
    // useEffect
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                let friendRef = onSnapshot(
                    doc(db, "users", auth.currentUser.uid),
                    (userFriends) => {
                        let arr = []
                        console.log(userFriends.data())
                        userFriends.data().friends.forEach(async (element) => {
                            let data = await getUserDetails(element)
                            arr.push(data)
                        });
                        setFriends(arr)
                    },
                    (error) => {
                        alertFailure(`${error.message}`)
                    });
            }
        })
    }, [auth]);

    useEffect(() => {
        if (auth.currentUser && friendRequestsModal) {
            getRequests(auth.currentUser.uid)
        }
    }, [friendRequestsModal]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                let userRef = onSnapshot(
                    doc(db, "users", auth.currentUser.uid),
                    (userDetails) => {
                        setUser(userDetails.data())
                    },
                    (error) => {
                        alertFailure(`${error.message}`)
                    })
            };
        })
    }, [auth, user]);

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
    const validateAction = (userId) => {
        let flag = false;
        friends.forEach((item) => {
            if (item.uid == userId) {
                flag = true;
            }
        })
        return flag;
    }
    const generateRoomId = (str1, str2) => {
        const arr = [];
        arr.push(str1.toLowerCase())
        arr.push(str2.toLowerCase())
        arr.sort()
        return (arr.join("_"))
    }
    const scrollToBottom = ()=>{
        let viewContainer = document.getElementById('view-container');
		viewContainer.scrollTop = viewContainer.scrollHeight;
    }

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
    const reset = (email) => {
        sendPasswordResetEmail(auth, email).then(() => {
            alertSuccess(`Reset email sent successfully!`)
        }).catch((error) => {
            alertFailure(`${error.message}`)
        });
    }

    // delete user
    const deleteAccount = () => {
        deleteUser(auth.currentUser).then(() => {
            alertSuccess(`User deleted successfully!`)
        }).catch((error) => {
            alertFailure(`${error.message}`)
        });
    }

    // re authenticate
    const reAuth = (credential) => {
        reauthenticateWithCredential(auth.currentUser, credential).then(() => {
            return true;
            console.log('hi')
        }).catch((error) => {
            console.log(error.message)
            return false;
        });
    }

    //----------------------------------------------------------------------------------------
    // send friend request
    const sendFriendRequest = async (userId, to) => {
        try {
            const q = query(collection(db, "requests"), where("to", "==", to), where("from", "==", userId));
            const querySnapshot = await getDocs(q);
            if (!(querySnapshot && querySnapshot.docs.length > 0)) {
                const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
                if(!(docSnap.data().friends.includes(to))){
                    const docRef = await addDoc(collection(db, "requests"), {
                        from: userId,
                        to: to
                    });
                    alertSuccess("Friend request sent successfully!")
                    setAddFriendModal(false)
                }
                else{
                alertFailure("Already a friend!")
                }
            }
            else {
                alertFailure("Friend request is already pending!")
            }
        } catch (e) {
            alertFailure("Failed to send friend request!")
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
            getRequests(auth.currentUser.uid)
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
            getRequests(auth.currentUser.uid)
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
            docRef = docRef = await updateDoc(doc(db, "users", removedFriendId), {
                friends: arrayRemove(userId)
            });
            // let roomId = generateRoomId(userId, removedFriendId)
            // await remove(ref(database, '/messages/' + roomId))
            alertSuccess(`Successfully removed the friend!`)
        } catch (error) {
            alertFailure(`Failed to remove the friend!`)
        }
    }

    const getRequests = async (userId) => {
        const q = query(collection(db, "requests"), where("to", "==", userId));

        const querySnapshot = await getDocs(q);
        let arr = []
        querySnapshot.forEach(async (doc) => {
            let docInstance = {
                id: doc.id,
                from: doc.data().from,
                to: doc.data().to
            }
            let fromData = await getUserDetails(doc.data().from)
            docInstance.from = fromData
            arr.push(docInstance)
        });
        setRequests(arr);
    }

    // get users friends
    const getUserFriends = (userId) => {
        let friendRef = onSnapshot(
            doc(db, "users", userId),
            (userFriends) => {
                let arr = []
                userFriends.data().friends.forEach((element) => {
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
                uid: userId,
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
    const getUserDetails = async (userId) => {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data()
        } else {
            return null;
        }
    }

    //----------------------------------------------------------------------------------------
    const sendMessage = async (from, to, content, sentAt) => {
        try {
            const MessagesListRef = ref(database, 'messages/' + generateRoomId(from, to));
            const newMessageRef = push(MessagesListRef);
            set(newMessageRef, {
                from: from,
                to: to,
                content: content,
                sentAt: sentAt
            });
        }
        catch (e) {
            alertFailure("Failed to send message.")
        }
    }
    
    const getMessages = (user1, user2)=>{
        const dbRef = query(ref(database, '/messages/' + generateRoomId(user1, user2)));
        
        onValue(dbRef, (snapshot) => {
            let messagesArray = [];
            snapshot.forEach((doc) => {
                messagesArray.push(doc.val());
            });
            setMessages(messagesArray)
            scrollToBottom()
        });
    }

    //----------------------------------------------------------------------------------------

    return (
        <MainContext.Provider value={{
            friends,
            setFriends,
            requests,
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
            declineFriendRequest,
            getUserFriends,
            getUserDetails,
            sendMessage,
            validateAction,
            messages,
            user,
            addFriendModal,
            setAddFriendModal,
            friendRequestsModal,
            setFriendRequestsModal,
            removeFriend,
            reset,
            userModal,
            setUserModal,
            updateProfile,
            reAuth,
            getMessages,
            currentFriend, 
            setCurrentFriend,
            scrollToBottom
        }}>
            {children}
        </MainContext.Provider>
    )
}