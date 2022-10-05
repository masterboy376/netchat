import ChatHeader from './ChatHeader'
// import MessageForm from './MessageForm'
import { useContext, useState } from 'react'
import { MainContext } from '../context/mainContext'
import MessageCard from './MessageCard'
import Image from 'next/image'
import MessageForm from './MessageFrom'
// import { Router } from 'next/router'

const ChatView = () => {
    const { router, messages } = useContext(MainContext)

    
    return (
        <div className={`flex flex-col h-screen w-full relative`}>
            {/* header  */}
            <ChatHeader />

            <div className="flex-1 w-full my-16 sm:my-14 overflow-y-auto flex flex-col px-2">
                {
                    messages.length>0?
                    <>
                        {
                            messages.map((item)=>{
                                return <MessageCard key={item.date} senderId={item.from} body={item.content} date={item.sentAt} />
                            })
                        }
                    </>
                    :
                    <p className='sm:text-lg text-base font-semibold text center my-auto mx-auto'>Start your conversation! 👍</p>
                }
                <MessageCard sender />
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