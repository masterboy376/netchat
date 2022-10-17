import { useEffect, useState } from 'react'
import { AiOutlineClose, AiOutlineLoading3Quarters } from 'react-icons/ai'
import React, { useContext } from 'react'
import { MainContext } from '../context/mainContext'
import FriendCard from './FriendCard'
import { FaUserPlus } from 'react-icons/fa'


const FriendList = () => {
  const { setIsLeftBar, isDark, friends, auth, setAddFriendModal } = useContext(MainContext)


  const [searchValue, setSearchValue] = useState('')
  const [friendsArray, setFriendsArray] = useState([])
  const [loadingFriends, setLoadingFriends] = useState(false)

  useEffect(() => {
    setLoadingFriends(true)
    if (friends) {
        setFriendsArray(friends)
    }
    setLoadingFriends(false)
  }, [friends])

  

  const onChange = (e) => {
    setSearchValue(e.target.value)
  }

  useEffect(() => {
    if (friends) {
      if (friends.length != 0) {
        if (searchValue.length != 0) {
          let arr = [...friends]
          for (let i = friends.length - 1; i >= 0; i--) {
            if (friends[i].name.toLowerCase().includes(searchValue.toLowerCase()) || friends[i].username.toLowerCase().includes(searchValue.toLowerCase())) {
              continue
            }
            else {
              arr.splice(i, 1)
              continue
            }
          }
          setFriendsArray(arr)
        }
        else {
          setFriendsArray([...friends])
        }
      }
    }
  }, [searchValue])

  return (
    <div className={`h-full w-full overflow-y-auto border-r ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'}`}>

      {/* header */}
      <div className={`fixed flex items-center w-full border-b border-r ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} bg-opacity-70 backdrop-blur-sm z-10 p-1 sm:p-2 shadow-sm`}>
        <input onChange={onChange} className={`flex-1 hover:border-blue-600 border ${isDark ? 'border-gray-800 bg-gray-800 text-gray-300' : 'border-gray-200 bg-gray-200 text-gray-900'} rounded-xl outline-none p-2 resize-none`} placeholder='Search your friend...' />
        <button type='button' onClick={() => { setIsLeftBar(false) }} className={`${isDark ? 'text-gray-300' : 'text-gray-900'} cursor-pointer m-2 flex items-center sm:hidden`}>
          <AiOutlineClose size={24} />
        </button>
      </div>

      <div className={`p-2 pt-10 sm:pt-14`}>
        <button onClick={()=>{setAddFriendModal(true)}} type='button' className={`flex items-center justify-center text-blue-500 border-2 border-blue-500 rounded-xl w-full py-2 sm:my-3 my-5 font-medium bg-blue-500 bg-opacity-5 hover:bg-opacity-10`}><FaUserPlus size={20} className={`mr-2`} />Add friend</button>

        <h1 className={`opacity-40 font-bold sm:my-2 my-4`}>FRIENDS</h1>


        {
          friends && <>
            {
              friendsArray.length != 0 ?
                friendsArray.map((item) => {
                  return <FriendCard key={item.uid} name={item.name} username={item.username} uid={item.uid} />
                })
                :
                <>
                  {
                loadingFriends ?
                  <AiOutlineLoading3Quarters className='animate-spin mx-auto my-4 opacity-60' size={24} />
                  :
                  <div className={`text-center font-bold my-4 opacity-40 text-sm`}>No friend found!</div>
              }
                </>
            }
          </>
        }



      </div>
    </div >
  )
}

export default FriendList