import Image from 'next/image'
// import at from '../public/icons/at.svg'
import { useContext, useEffect, useState } from 'react'
import { MainContext } from '../context/mainContext'
import { HiMenuAlt2 } from 'react-icons/hi'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { FaUserCircle, FaUserPlus, FaPhoneVolume, FaVideo } from 'react-icons/fa'
import { MdNotificationsNone } from 'react-icons/md'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const ChatHeader = () => {
  const { setIsLeftBar, setIsRightBar, logout, isDark, friends, getUserDetails, router } = useContext(MainContext)
  const [friendDetails, setFriendDetails] = useState(null)

  useEffect(() => {
    if (friends) {
      friends.forEach(element => {
        if (element.uid == router.query.uid) {
          setFriendDetails(element)
        }
      });
    }
  }, [router, friends])



  return (
    <div className={`fixed z-10 top-0 right-0 w-full sm:w-3/4 bg-opacity-70 backdrop-blur-sm flex items-center justify between sm:p-2 p-3 border-b ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} shadow-sm`}>

      <button type='button' onClick={() => { setIsLeftBar(true) }} className={`${isDark ? 'text-gray-300' : 'text-gray-900'} cursor-pointer mr-2 sm:hidden`}>
        <HiMenuAlt2 size={24} />
      </button>

      <div className={`flex items-center flex-1`}>
        {
          friendDetails && <>
            <div className={`mr-2 flex items-center rounded-full w-8 h-8 sm:w-10 sm:h-10 justify-center font-bold text-2xl bg-blue-500`}>
              {friendDetails.name[0].toUpperCase()}
            </div>
            <div className={`flex-1 h-full opacity-90`}>
              <p className={`font-bold text-sm`}>{friendDetails.username}</p>
              <p className={`opacity-60 text-sm`}>{friendDetails.name}</p>
            </div>
          </>
        }
      </div>

      {/* {router.query.user &&
        <div className={styles.headerIconsContainer}>  
        <Tippy content={'Phone'}>
          <button onClick={() => { setPhoneModal(true) }} className={styles.headerItem}>
            <FaPhoneVolume size={25} className={`opacity-70 cursor-pointer`} />
          </button>
        </Tippy>

          <Tippy content={'Video call'}>
            <button onClick={() => { setVideoModal(true) }} className={styles.headerItem}>
              <FaVideo size={25} className={`opacity-70 cursor-pointer`} />
            </button>
          </Tippy>
        </div>
      }

      <Tippy content={'Add friend'}>
        <button onClick={() => { setAddFriendModal(true) }} className={styles.headerItem}>
          <FaUserPlus size={25} className={`opacity-70 cursor-pointer`} />
        </button>
      </Tippy>

      <Tippy content={'Your details'}>
        <button onClick={() => { setUserModal(true) }} className={styles.headerItem}>
          <FaUserCircle size={25} className={`opacity-70 cursor-pointer`} />
        </button>
      </Tippy> */}

      <Tippy content={'Notifications'}>
        <button onClick={() => { setUserModal(true) }} className={`${isDark ? 'text-gray-300' : 'text-gray-900'} cursor-pointer mr-4 sm:block hidden`}>
          <MdNotificationsNone size={30} className={`cursor-pointer`} />
        </button>
      </Tippy>

      <Tippy content={'Your Profile'}>
        <button onClick={() => { setUserModal(true) }} className={`${isDark ? 'text-gray-300' : 'text-gray-900'} cursor-pointer mr-4 sm:block hidden`}>
          <FaUserCircle size={30} className={`cursor-pointer`} />
        </button>
      </Tippy>

      <button type='button' className={`mx-2 text-white bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 border font-medium py-2 rounded-xl cursor-pointer hidden sm:inline px-4`} onClick={logout}>
        Log out
      </button>

      <button type='button' onClick={() => { setIsRightBar(true) }} className={`${isDark ? 'text-gray-300' : 'text-gray-900'} cursor-pointer mr-2 sm:hidden`}>
        <BsThreeDotsVertical size={24} />
      </button>
    </div>
  )
}

export default ChatHeader