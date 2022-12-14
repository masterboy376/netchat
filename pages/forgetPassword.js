import React, { useContext, useState, useEffect } from 'react'
import { MdSecurity } from 'react-icons/md'
import Link from 'next/link'
import Head from 'next/head'
import { MainContext } from '../context/mainContext'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const ForgetPassword = () => {
  const { isDark, auth, router, onAuthStateChanged, reset } = useContext(MainContext)

  const [sending, setSending] = useState(false)
  const [credentials, setCredentials] = useState()

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
          if (user) {
              router.push('/')
          }
      })
  }, [])

  const onChange = (e) => {
    setCredentials(e.target.value)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    reset(credentials)
    setSending(false)
  }


  return (
    <>
      <Head>
        <title>NetChat | Forget Password</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      
      <div className={`min-h-screen flex items-center justify-center px-4 ${isDark?'bg-gray-900 text-gray-300':'bg-white text-gray-900'}`}>
        <div className={`max-w-md w-full space-y-3 h-min mx-auto my-auto ${sending ? 'pointer-events-none' : ''}`}>
          <div>
            <img
              className="mx-auto h-20 w-auto"
              src={`/favicon.svg`}
              alt="Logo"
            />
            <h2 className={`mt-4 text-center text-2xl sm:text-3xl font-extrabold`}>Sign in to your account</h2>
          </div>
          <form onSubmit={onSubmit} className="mt-2 space-y-6" action="#" method="POST">
            <div className="shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  disabled={sending}
                  onChange={onChange}
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`rounded-xl border hover:border-blue-600 ${isDark?'border-gray-800 bg-gray-800 text-gray-300':'border-gray-200 bg-gray-200 text-gray-900'}  w-full outline-none p-2 h-11/12 resize-none mb-2`}
                  placeholder="Email"
                />
              </div>
            </div>


            <div>
              <button
                disabled={sending}
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 "
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <MdSecurity className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" size={24} />
                </span>
                {sending ?
                  <AiOutlineLoading3Quarters className='animate-spin' size={24} />
                  :
                  'Send reset link'
                }
              </button>
            </div>
            <div className="text-sm flex justify-between">
              Able to recall password?
              <Link href="/signin">
                <a disabled={sending} className="font-medium hover:underline underline-offset-2 text-blue-600 hover:text-blue-700">
                  Login
                </a>
              </Link>
            </div>
            <p className={`${isDark?'text-gray-200':'text-gray-900'} text-center text-sm opacity-60 font-medium`}>If reset link not recived in Indox, then check in Spam folder.</p>
          </form>
        </div>
      </div>
    </>
  )
}

export default ForgetPassword