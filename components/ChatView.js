import ChatHeader from './ChatHeader'
// import MessageForm from './MessageForm'
import { useContext, useState } from 'react'
import { MainContext } from '../context/mainContext'
// import MessageCard from './MessageCard'
import Image from 'next/image'

const ChatView = () => {
    // const { router, userData, socket, messages, setMessages, friend } = useContext(MainContext)

    // socket.on('receive', data => {
    //     let tempArray = [...messages]
    //     tempArray.push(data)
    //     console.log(data)
    //     setMessages(tempArray)
    // })

    return (
        <div className={`flex-6 h-screen w-full relative overflow-y-scroll`}>
            {/* header  */}
            <ChatHeader />

            {/* <div className='w-full h-full flex items-center justify-center'>
                <Image src={'/waiting.svg'} width={400} height={400} className='mx-auto my-auto'></Image>
            </div> */}

        </div>
    )
}

export default ChatView