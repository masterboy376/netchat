import React, { useContext } from 'react'
import { MainContext } from '../context/mainContext'
import { AiOutlineClose } from 'react-icons/ai'
import { FaUserCircle } from 'react-icons/fa'
import { MdNotificationsNone } from 'react-icons/md'

const MoreOption = () => {
    const { isRightBar, setIsRightBar, logout, isDark } = useContext(MainContext)

    return (
        <div className={`w-full transition-all duration-300 sm:hidden border-l ${isDark ? 'text-gray-300 border-gray-700 bg-gray-900 ' : 'text-gray-900 border-gray-300 bg-white'} ${isRightBar ? 'translate-x-0' : 'translate-x-full'} sm:hidden block fixed top-0 right-0 h-screen`}>
            <div className={`flex items-center justify-between border-b z-10 p-1 ${isDark ? 'border-gray-700' : 'border-gray-300'} shadow-sm`}>
                <div className={`opacity-40 font-bold my-2`}>More Options</div>
                <div onClick={() => { setIsRightBar(false) }} className={`${isDark ? 'text-gray-300' : 'text-gray-900'} cursor-pointer mr-2 sm:hidden`}>
                    <AiOutlineClose size={24} />
                </div>
            </div>
            <div className={`flex items-center p-2 rounded-md cursor-pointer mb-2 mx-2 my-2  ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}>
                <div className={`mr-2`}>
                <MdNotificationsNone size={28} className={`${isDark ? 'text-gray-300' : 'text-gray-900'} cursor-pointer sm:hidden`} />
                </div>
                <p>Notifications</p>
            </div>
            <div className={`flex items-center p-2 rounded-md cursor-pointer mb-2 mx-2 my-2  ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}>
                <div className={`mr-2`}>
                <FaUserCircle size={28} className={`${isDark ? 'text-gray-300' : 'text-gray-900'} cursor-pointer sm:hidden`} />
                </div>
                <p>Your profile</p>
            </div>
            <button className={`mx-auto w-1/2 text-white bg-blue-500 hover:bg-blue-600 font-medium p-2 rounded-xl justify-evenly flex items-center`} onClick={logout}>
                Log out
            </button>

        </div>
    )
}

export default MoreOption