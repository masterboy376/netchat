import { useContext, useState } from 'react'
import { MainContext } from '../context/mainContext'
import {RiSendPlaneFill} from 'react-icons/ri'

const MessageForm = ({to}) => {
  const {validateAction, auth, sendMessage, isDark, alertFailure} = useContext(MainContext)
  const [messageBody, setMessageBody] = useState('')

  const onChange = (e)=>{
    setMessageBody(e.target.value)
  }

  const onSubmit = (e)=>{
    e.preventDefault()
    if(validateAction(to)){
      sendMessage(auth.currentUser.uid, to, messageBody, Date.now())
    }
    else{
      alertFailure('Action denied!')
    }
    setMessageBody('')
  }

  return (
    <form onSubmit={onSubmit}
      className={`fixed ${isDark?'bg-gray-900':'bg-white'} bg-opacity-70 backdrop-blur-sm bottom-0 right-0 w-full sm:w-3/4 py-2 px-3`}
    >
      <div className={`rounded-xl hover:border-blue-600 border ${isDark?'border-gray-800 bg-gray-800':'border-gray-200 bg-gray-200'} px-3 w-full h-10 flex items-center justify-center`}>
        <input
        onChange={onChange}
        id='message'
        name='message'
          type='text'
          className={`w-full bg-transparent outline-none p-3 h-11/12 resize-none`}
          value={messageBody}
          disabled={false}
          placeholder={'type ypur message here'}
          required
        />
        <button type='submit' disabled={messageBody.length==0} className={`mr-4 flex items center`}>
          <RiSendPlaneFill className={`w-6 cursor-pointer hover:text-blue-500 transition-all duration-300`} size={40}/>
        </button>
        
      </div>
    </form>
  )
}

export default MessageForm