import React, { useEffect, useState, useContext } from 'react'
import { MainContext } from '../context/mainContext'

const MessageCard = ({ senderId, body, date }) => {

  const { auth, friends, user, isDark } = useContext(MainContext)
  const [sender, setSender] = useState(null);
  const init = async () => {
    if(user){
      if (user.uid == senderId) {
        setSender(user)
        return;
      }
      friends.forEach((item) => {
        if (item.uid == senderId) {
          setSender(item)
          return;
        }
      })
      return;
    }
    }
  useEffect(() => {
    init()
  }, [user])


  return (
    <>
      {(sender && auth.currentUser) && <div className={`${sender.uid == auth.currentUser.uid ? 'bg-blue-500 self-end text-white' : `${isDark? 'bg-gray-800 text-white':'bg-gray-200 text-gray-900'}self-start`} bg-opacity-90 flex rounded-xl sm:p-3 p-2 w-2/3 my-2`}>

        <div className={`mr-2 flex items-center rounded-full w-6 h-6 text-lg sm:w-10 sm:h-10 justify-center font-bold sm:text-2xl bg-blue-500`}>
          {sender.name && sender.name[0].toUpperCase()}
        </div>

        <div className="flex-1 pl-2">
          <div className="flex sm:flex-row flex-col items-start sm:items-center w-full justify-start sm:justify-between">
            <div className="flex flex-col items-start justify-center">
              <span className="font-bold opacity-90">{sender.username}</span>
              <span className="opacity-90">{sender.name}</span>
            </div>
            <span className="opacity-60">{new Date(date).toLocaleString('en-US', {
                  timeZone: 'PST',
                  hour12: true,
                  timeStyle: 'short',
                  dateStyle: 'long',
                })}</span>
          </div>
          <p className="my-2 ">{body}</p>
        </div>
      </div>}
    </>
  )
}

export default MessageCard