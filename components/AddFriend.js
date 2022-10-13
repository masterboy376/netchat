import React, { useContext, useState } from 'react'
import { AiOutlineClose, AiOutlineLoading3Quarters } from 'react-icons/ai'
import { MainContext } from '../context/mainContext'

const AddFriend = () => {
    const { auth, router, setAddFriendModal, getUserDetails, sendFriendRequest, isDark } = useContext(MainContext)

    const [result, setResult] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [adding, setAdding] = useState(false)
    const [userId, setUserId] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        setProcessing(true)
        const data = await getUserDetails(userId)
        setResult(data)
        setProcessing(false)
    }

    const onAdd = async (e, to) => {
        e.preventDefault()
        setAdding(true)
        const data = await sendFriendRequest(auth.currentUser.uid, to)
        setAdding(false)
    }

    return (
        <div className={`w-full p-4 ${processing || adding ? 'pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between w-full pb-4">
                <span className={`text-lg font-bold opacity-40 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Find your friend</span>
                <AiOutlineClose onClick={() => { setAddFriendModal(false) }} className={`${isDark ? 'text-gray-300' : 'text-gray-900'}`} size={20} />
            </div>
            <form onSubmit={onSubmit} action="#">
                <div className="flex items-center justify-between w-full pb-4">
                    <input onChange={(e) => { setUserId(e.target.value) }} disabled={processing} type="text" placeholder='Find your friend with ID' id="friendId" name='friendId' className={`block p-4 h-full w-full rounded-l-xl border sm:text-md outline-none hover:border-blue-600 ${isDark ? 'bg-gray-800 border-gray-800' : 'bg-gray-200 border-gray-200'} text-white`} />
                    <button type="submit" disabled={processing} className={`text-white bg-blue-500 hover:bg-blue-600 p-4 rounded-r-xl cursor-pointer sm:w-auto font-medium`}>
                        {processing ?
                            <AiOutlineLoading3Quarters className='animate-spin mx-auto' size={24} />
                            :
                            'Find'
                        }
                    </button>
                </div>
            </form>
            {
                result ?
                    <>
                        {result.uid != undefined ?
                            <>
                                <div className={`w-full flex sm:flex-row flex-col border-t border-gray-700 pt-2`}>
                                    <div className="flex sm:flex-row flex-col items-center w-full h-full">
                                        <div className={`mr-2 mb-1 sm:mb-0 flex items-center rounded-full w-10 h-10 text-white justify-center font-bold text-2xl bg-blue-500`}>
                                            {result.name && result.name[0].toUpperCase()}
                                        </div>
                                        <div className="w-full h-full mb-1 sm:mb-0">
                                            <p className={`font-bold ${isDark?'text-gray-300':'text-gray-900'}`}>{result.username}</p>
                                            <p className={`opacity-60 text-sm ${isDark?'text-gray-300':'text-gray-900'}`}>{result.name}</p>
                                        </div>
                                    </div>
                                    <div className="sm:w-auto w-full mx-auto h-full">
                                        <button key='uniqueKey' onClick={(e) => { onAdd(e, result.uid) }} type="button" className={`font-medium text-blue-500 hover:underline underline-offset-4 py-2 rounded-xl cursor-pointer px-2 sm:w-auto w-full`}>{adding ?
                                            <AiOutlineLoading3Quarters className='animate-spin mx-auto' size={24} />
                                            :
                                            'Request'
                                        }</button>
                                    </div>
                                </div>
                            </>
                            :
                            <><div className={`text-center font-bold opacity-40`}>No user found with this id...</div></>
                        }</>
                    :
                    <>
                        <div className={`${isDark ? 'text-gray-300' : 'text-gray-900'} text-center font-bold opacity-40`}>Search your friend by ID...</div>
                    </>
            }
        </div>
    )
}

export default AddFriend