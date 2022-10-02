import ChatHeader from './ChatHeader'
// import MessageForm from './MessageForm'
import { useContext, useState } from 'react'
import { MainContext } from '../context/mainContext'
// import MessageCard from './MessageCard'
import Image from 'next/image'
import MessageForm from './MessageFrom'
// import { Router } from 'next/router'

const ChatView = () => {
    const { router, messages } = useContext(MainContext)

    
    return (
        <div className={`flex flex-col h-screen w-full relative`}>
            {/* header  */}
            <ChatHeader />

            <div className="flex-1 w-full my-16 sm:my-14 overflow-y-auto">

            </div>

            {/* message form */}
            <MessageForm to={router.query.uid}/>

            {/* <div className='w-full h-full flex items-center justify-center'>
                <Image src={'/waiting.svg'} width={400} height={400} className='mx-auto my-auto'></Image>
            </div> */}

        </div>
    )
}

export default ChatView