import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.webp"
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/UserSlice';
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import axios from 'axios';
import { serverUrl } from '../main';
import { setMessages } from '../redux/messageSlice';

function MessageArea() {
  let { selectedUser, userData, socket } = useSelector(state => state.user)
  let dispatch = useDispatch()
  let [showPicker, setShowPicker] = useState(false)
  let [input, setInput] = useState("")
  let [frontendImage, setFrontendImage] = useState(null)
  let [backendImage, setBackendImage] = useState(null)
  let image = useRef()
  let { messages } = useSelector(state => state.message)

  const handleImage = (e) => {
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (input.length === 0 && backendImage === null) return

    try {
      let formData = new FormData()
      formData.append("message", input)
      if (backendImage) formData.append("image", backendImage)

      let result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, formData, { withCredentials: true })
      dispatch(setMessages([...messages, result.data]))
      setInput("")
      setFrontendImage(null)
      setBackendImage(null)
    } catch (error) {
      console.log(error)
    }
  }

  const onEmojiClick = (emojiData) => {
    setInput(prev => prev + emojiData.emoji)
    setShowPicker(false)
  }

  useEffect(() => {
    socket?.on("newMessage", (mess) => {
      dispatch(setMessages([...messages, mess]))
    })
    return () => socket?.off("newMessage")
  }, [messages, setMessages])

  return (
    <div className={`lg:w-[70%] relative ${selectedUser ? "flex" : "hidden"} lg:flex w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden`}>

      {selectedUser &&
        <div className='w-full h-[100vh] flex flex-col gap-[20px]'>
          {/* Header */}
          <div className='w-full h-[100px] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-b-[30px] shadow-xl flex items-center px-[20px] gap-4'>
            <div className='cursor-pointer' onClick={() => dispatch(setSelectedUser(null))}>
              <IoIosArrowRoundBack className='w-[40px] h-[40px] text-white' />
            </div>
            <div className='w-[50px] h-[50px] rounded-full overflow-hidden flex items-center justify-center bg-white shadow-md'>
              <img src={selectedUser?.image || dp} alt="" className='h-full object-cover' />
            </div>
            <h1 className='text-white font-semibold text-xl'>{selectedUser?.name || "User"}</h1>
          </div>

          {/* Chat Body */}
          <div className='w-full h-[70%] px-5 py-6 overflow-auto flex flex-col gap-5 scroll-smooth'>
            {showPicker && (
              <div className='absolute bottom-[120px] left-[20px] z-50'>
                <EmojiPicker width={250} height={350} onEmojiClick={onEmojiClick} />
              </div>
            )}

            {messages && messages.map((mess, i) =>
              mess.sender === userData._id ?
                <SenderMessage key={i} image={mess.image} message={mess.message} />
                : <ReceiverMessage key={i} image={mess.image} message={mess.message} />
            )}
          </div>
        </div>
      }

      {/* Input Section */}
      {selectedUser && (
        <div className='w-full lg:w-[70%] fixed bottom-5 flex justify-center items-center'>
          {frontendImage && (
            <img src={frontendImage} alt="" className='w-[70px] h-[70px] absolute bottom-[80px] right-[20%] rounded-md shadow-md' />
          )}
          <form
            className='w-[95%] lg:w-[70%] h-[60px] bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center gap-4 px-6 shadow-lg'
            onSubmit={handleSendMessage}
          >
            <RiEmojiStickerLine onClick={() => setShowPicker(prev => !prev)} className='w-6 h-6 text-white cursor-pointer' />
            <input type="file" accept='image/*' hidden ref={image} onChange={handleImage} />
            <input
              type="text"
              className='w-full h-full px-3 bg-transparent outline-none text-white placeholder-white text-lg'
              placeholder='Type a message...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <FaImages className='w-6 h-6 text-white cursor-pointer' onClick={() => image.current.click()} />
            {(input.length > 0 || backendImage) && (
              <button type="submit">
                <RiSendPlane2Fill className='w-6 h-6 text-white cursor-pointer' />
              </button>
            )}
          </form>
        </div>
      )}

      {!selectedUser && (
        <div className='w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
          <h1 className='text-white font-bold text-5xl animate-pulse'>Welcome to Chatly</h1>
          <p className='text-gray-300 text-2xl mt-2'>Chat Friendly!</p>
        </div>
      )}
    </div>
  )
}

export default MessageArea
