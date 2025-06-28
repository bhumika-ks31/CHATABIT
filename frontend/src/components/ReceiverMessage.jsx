import React, { useEffect, useRef } from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'

function ReceiverMessage({ image, message }) {
  const scroll = useRef()
  const { selectedUser } = useSelector(state => state.user)

  useEffect(() => {
    scroll?.current.scrollIntoView({ behavior: "smooth" })
  }, [message, image])

  const handleImageScroll = () => {
    scroll?.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className='flex items-start gap-3 px-3 animate-fade-in'>
      {/* Profile Image */}
      <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center items-center border-2 border-cyan-400 shadow-md shadow-cyan-500/30'>
        <img src={selectedUser.image || dp} alt="dp" className='h-full object-cover' />
      </div>

      {/* Message Bubble */}
      <div
        ref={scroll}
        className='max-w-[500px] px-4 py-2 bg-gradient-to-br from-cyan-700 to-blue-800 text-white text-[16px] rounded-tl-none rounded-2xl shadow-md shadow-cyan-500/30 flex flex-col gap-2 transition-all duration-300 ease-in-out'
      >
        {image && (
          <img
            src={image}
            alt="attachment"
            className='w-[150px] rounded-lg hover:scale-105 transition-transform duration-200'
            onLoad={handleImageScroll}
          />
        )}
        {message && <span className='break-words'>{message}</span>}
      </div>
    </div>
  )
}

export default ReceiverMessage
