import React, {useEffect, useState, useContext} from 'react'
import { MainContext } from '../context/mainContext'

const MessageCard = ({sender, body, date }) => {

    const {auth} = useContext(MainContext)
    

  return (
    <>
    {(senderData && userData) && <div className={`${sender.uid==auth.currentUser.uid?'bg-gray-700 self-end':'bg-gray-800 self-start'} bg-opacity-70 flex rounded-xl sm:p-3 p-2 w-2/3 my-2`}>

    <div className={`mr-2 flex items-center rounded-full w-10 h-10 justify-center font-bold text-2xl ${senderData.avatarColor}`}>
            {senderData.name && senderData.name[0].toUpperCase()}
          </div>
            
            <div className="flex-1 pl-2">
              <div className="flex sm:flex-row flex-col items-start sm:items-center w-full justify-start sm:justify-between">
                <div className="flex flex-col items-start justify-center">
                <span className="font-bold opacity-90">{sender.username}</span>
                <span className="opacity-90">{sender.name}</span>
                </div>
                <span className="opacity-60">{date}</span>
              </div>
              <p className="my-2">{body}</p>
            </div>
         </div>}
    </>
  )
}

export default MessageCard