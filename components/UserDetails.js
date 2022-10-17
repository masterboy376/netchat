import React, { useContext, useState, useEffect } from 'react'
import { AiOutlineClose, AiOutlineLoading3Quarters, AiFillCheckCircle } from 'react-icons/ai'
import { MainContext } from '../context/mainContext'
import Link from 'next/link'
import Modal from 'react-modal'


const UserDetails = () => {
    const { setUserModal, user, updateProfile, isDark, getUserDetails, auth, alertSuccess, reAuth, reset } = useContext(MainContext)

    const [processing, setProcessing] = useState(false)
    const [newData, setNewData] = useState({})
    const [hasChanged, setHasChanged] = useState(false)
    const [reveal, setReveal] = useState(false)
    const [verifyPasswordForChange, setVerifyPasswordForChange] = useState(false)
    const [verifyPasswordForReveal, setVerifyPasswordForReveal] = useState(false)
    const [password, setPassword] = useState('')

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgb(17 ,24, 39)',
            padding: 0,
            border: '1px solid rgb(55, 65, 81)',
            borderRadius: '15px',
            width: '90%',
            maxWidth: '700px',
        },
        overlay: {
            backgroundColor: 'rgba(17, 24, 39, 0.5)',
        },
    }

    const onChange = (e) => {
        setNewData({ ...newData, [e.target.name]: e.target.value })
        setHasChanged(true)
    }

    const onCancel = () => {
        setNewData({ name: user.name, username: user.username, email: user.email })
        setHasChanged(false)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setVerifyPasswordForChange(false)
        setProcessing(true)
        await updateProfile(auth.currentUser.uid, newData)
        await getUserDetails(auth.currentUser.uid)
        setProcessing(false)
        setHasChanged(false)
    }

    const onReveal = async (e) => {
        e.preventDefault()
        setVerifyPasswordForReveal(false)
        setReveal(true)
        setTimeout(() => {
            setReveal(false)
        }, 30000);
    }

    const copyId = async () => {
        navigator.clipboard.writeText(user.uid)
        alertSuccess("Id copied to clip board")
    }

    useEffect(() => {
        setNewData({ name: user.name, username: user.username, email: user.email })
    }, [user])

    return (
        <>
            <div className={`w-full max-w-4xl mx-auto ${processing ? 'pointer-events-none' : ''}`}>

                <div className={`flex p-4 mb-6 items-center justify-between w-full pb-4 border-b ${isDark?'border-gray-700':'border-gray-300'}`}>
                    <div className="flex items-center">
                        <span className={`sm:text-base text-sm cursor-pointer mr-4 sm:mr-6 hover:underline underline-offset-4 font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'} opacity-70`}>Profile</span>
                    </div>
                    <AiOutlineClose onClick={() => { setUserModal(false) }} className={`opacity-70 ${isDark ? 'text-gray-200' : 'text-gray-900'}`} size={20} />
                </div>

                <div className="px-4 flex flex-col justify-between items-center w-full pb-2 space-y-3">

                    <div onClick={() => {
                        reveal ?
                            copyId()
                            :
                            setVerifyPasswordForReveal(true)
                    }}
                        className={`w-2/3 text-center cursor-pointer mx-auto ${isDark?'text-white border-gray-800 bg-gray-800':'text-gray-900 border-gray-200 bg-gray-200'} hover:border-blue-600 rounded-lg border py-2 ${reveal ? 'font-bold' : ''}`}>
                        {reveal ? user.uid : 'Tap here to reveal your ID for 30 sec'}
                    </div>

                    <div className={`sm:w-64 sm:h-64 w-32 h-32 rounded-full flex items-center text-white justify-center font-bold text-9xl bg-blue-500`}>
                        {user.name[0] ? user.name[0].toUpperCase() : '-'}
                    </div>

                    <input required disabled={processing} defaultValue={user.name} onChange={onChange} type="text" placeholder='Name' id="name" name='name' className={`block p-2 h-full w-full rounded-xl border sm:text-md outline-none hover:border-blue-500 ${isDark?'text-white border-gray-800 bg-gray-800':'text-gray-900 border-gray-200 bg-gray-200'}`} />

                    <input required disabled={processing} defaultValue={user.username} onChange={onChange} placeholder='Username' name="username" id="username" className={`block p-2 h-full w-full rounded-xl border sm:text-md outline-none hover:border-blue-500 ${isDark?'text-white border-gray-800 bg-gray-800':'text-gray-900 border-gray-200 bg-gray-200'}`} />

                    <input required disabled={processing} defaultValue={user.email} onChange={onChange} placeholder='Email' name="email" id="email" className={`block p-2 h-full w-full rounded-xl border sm:text-md outline-none hover:border-blue-500 ${isDark?'text-white border-gray-800 bg-gray-800':'text-gray-900 border-gray-200 bg-gray-200'}`} />

                    <div className="flex w-full justify-between">
                        <>
                            <a disabled={processing} onClick={()=>{
                                reset(user.email)
                            }} className={`w-auto text-sm rounded-xl cursor-pointer font-medium hover:text-blue-700 text-blue-600 hover:underline underline-offset-4`}>
                                {
                                    'Change password'
                                }
                            </a>
                        </>
                        <div>
                            <button disabled={!hasChanged} onClick={onCancel} type='button' className={`font-medium text-red-500 hover:text-red-600 mr-4`}>
                                {
                                    'Cancel'
                                }
                            </button>
                            <button disabled={!hasChanged} type='button' onClick={onSubmit} className={`bg-blue-500 text-white ${hasChanged ? ' hover:bg-blue-600' : 'opacity-70 cursor-not-allowed'} p-2 w-auto rounded-xl`}>
                                {processing ?
                                    <AiOutlineLoading3Quarters className='animate-spin mx-auto' size={20} />
                                    :
                                    'Save'
                                }
                            </button>
                        </div>
                    </div>

                </div>
                <Modal isOpen={verifyPasswordForReveal} onRequestClose={() => { setVerifyPasswordForReveal(false) }} style={customStyles}>
                    <div className={`w-full p-4 ${isDark?'text-gray-200 bg-gray-900':'text-gray-900 bg-white'}`}>
                        <div className="flex items-center justify-between w-full pb-4">
                            <span className={`${isDark?'text-gray-200':'text-gray-900'} text-lg font-bold opacity-40`}>Verify your password</span>
                            <AiOutlineClose onClick={() => { setVerifyPasswordForReveal(false) }} className={`opacity-70 ${isDark?'text-gray-200':'text-gray-900'}`} size={20} />
                        </div>
                        <form onSubmit={onReveal} action="#">
                            <div className="flex items-center justify-between w-full pb-4">
                                <input onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder='Your password' id="password" name='password' className={`block p-4 h-full w-full rounded-l-xl border sm:text-md outline-none hover:border-blue-600 ${isDark?'text-white border-gray-800 bg-gray-800':'text-gray-900 border-gray-200 bg-gray-200'}`} />
                                <button type="submit" className={` bg-blue-600 hover:bg-blue-700 p-4 rounded-r-xl cursor-pointer sm:w-auto text-white font-medium`}>
                                    {processing ?
                                        <AiOutlineLoading3Quarters className='animate-spin mx-auto' size={24} />
                                        :
                                        'Ok'
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>

            </div>

        </>
    )
}

export default UserDetails