import React, { useContext } from 'react'
import { MainContext } from '../context/mainContext'
import {FaUserTimes, FaPhoneVolume, FaVideo } from 'react-icons/fa'

const FriendCard = ({ username, name }) => {
    const { router, isDark } = useContext(MainContext)
    return (
        <div onClick={() => { router.push(`/?user=${username}`) }} className={`flex items-center p-2 rounded-xl ${isDark ? 'hover:bg-gray-800 bg-zinc-900' : 'hover:bg-gray-200 bg-slate-100'} cursor-pointer my-1`}>
            <div className={`mr-2 flex items-center rounded-full w-10 h-10 justify-center font-bold text-2xl bg-blue-500`}>
                {name[0].toUpperCase()}
            </div>
            <div className={`flex-1 h-full opacity-90`}>
                <p>{username}</p>
                <p className={`opacity-60 text-sm`}>{name}</p>
            </div>
            <div className={`flex items-center`}>
                <button onClick={(e)=>{
                    e.stopPropagation()
                    console.log('clicked')
                }} className={`ml-2`}><FaPhoneVolume size={20}/></button>
                <button onClick={(e)=>{
                    e.stopPropagation()
                    console.log('clicked')
                }} className={`ml-2`}><FaVideo size={20}/></button>
                <button onClick={(e)=>{
                    e.stopPropagation()
                    console.log('clicked')
                }} className={`ml-2`}><FaUserTimes size={20}/></button>
            </div>
        </div>
    )
}

export default FriendCard