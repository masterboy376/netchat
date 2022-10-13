import React, { useContext, useState } from 'react'
import { AiOutlineClose, AiOutlineLoading3Quarters } from 'react-icons/ai'
import { MainContext } from '../context/mainContext'

const FriendRequests = () => {
    const { auth, setFriendRequestsModal, getUserDetails, sendFriendRequest, isDark, requests, acceptFriendRequest, declineFriendRequest } = useContext(MainContext)

    const [result, setResult] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [adding, setAdding] = useState(false)
    const [userId, setUserId] = useState('')

    return (
        <div className={`w-full p-4 ${processing || adding ? 'pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between w-full pb-4">
                <span className={`text-lg font-bold opacity-40 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>Friend Requests</span>
                <AiOutlineClose onClick={() => { setFriendRequestsModal(false) }} className={`${isDark ? 'text-gray-300' : 'text-gray-900'}`} size={20} />
            </div>
            {
                requests ?
                    <>
                        {requests.length > 0 ?
                            <>
                                {
                                    requests.map((request) => {
                                        return <div key={request.id} className={`w-full flex sm:flex-row flex-col border-t border-gray-700 pt-2`}>
                                            <div className="flex sm:flex-row flex-col items-center w-full h-full">
                                                <div className={`mr-2 mb-1 sm:mb-0 flex items-center rounded-full w-10 h-10 text-white justify-center font-bold text-2xl bg-blue-500`}>
                                                    {request.from.name && request.from.name[0].toUpperCase()}
                                                </div>
                                                <div className="w-full h-full mb-1 sm:mb-0">
                                                    <p className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{request.from.username}</p>
                                                    <p className={`opacity-60 text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{request.from.name} : Sent you a friend request</p>
                                                </div>
                                            </div>
                                            <div className="sm:w-auto w-full my-auto mx-auto h-full flex">
                                                <button key='uniqueKey' onClick={(e) => { acceptFriendRequest(auth.currentUser.uid, request.id) }} type="button" className={`font-medium text-green-500 border-2 border-green-500 bg-green-500 bg-opacity-5 hover:bg-opacity-10 text-sm rounded-xl cursor-pointer sm:w-auto w-full px-1`}>{adding ?
                                                    <AiOutlineLoading3Quarters className='animate-spin mx-auto' size={24} />
                                                    :
                                                    'Accept'
                                                }</button>
                                                <button key='uniqueKey' onClick={(e) => { declineFriendRequest(request.id) }} type="button" className={`font-medium text-red-500 border-2 border-red-500 bg-red-500 bg-opacity-5 hover:bg-opacity-10 text-sm rounded-xl cursor-pointer sm:w-auto w-full px-1 ml-2`}>{adding ?
                                                    <AiOutlineLoading3Quarters className='animate-spin mx-auto' size={24} />
                                                    :
                                                    'Reject'
                                                }</button>
                                            </div>
                                        </div>
                                    })
                                }
                            </>
                            :
                            <><div className={`text-center font-bold opacity-40 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>No pending friend request yet!</div></>
                        }</>
                    :
                    <>
                        <div className={`${isDark ? 'text-gray-300' : 'text-gray-900'} text-center font-bold opacity-40`}>No pending friend request yet!</div>
                    </>
            }
        </div>
    )
}

export default FriendRequests