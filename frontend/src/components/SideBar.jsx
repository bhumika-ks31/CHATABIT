import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from "../assets/dp.webp"
import { IoIosSearch } from "react-icons/io"
import { RxCross2 } from "react-icons/rx"
import { BiLogOutCircle } from "react-icons/bi"
import { serverUrl } from '../main'
import axios from 'axios'
import { setOtherUsers, setSearchData, setSelectedUser, setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

function SideBar() {
  const { userData, otherUsers, selectedUser, onlineUsers, searchData } = useSelector(state => state.user)
  const [search, setSearch] = useState(false)
  const [input, setInput] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      dispatch(setUserData(null))
      dispatch(setOtherUsers(null))
      navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }

  const handlesearch = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/search?query=${input}`, { withCredentials: true })
      dispatch(setSearchData(result.data))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (input) {
      handlesearch()
    }
  }, [input])

  return (
    <div className={`lg:w-[30%] w-full h-full bg-[#0f172a] text-white overflow-hidden ${!selectedUser ? "block" : "hidden"} lg:block`}>
      
      {/* Logout Button */}
      <div className='w-[60px] h-[60px] mt-[10px] fixed bottom-[20px] left-[10px] rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex justify-center items-center cursor-pointer shadow-md shadow-cyan-400 hover:scale-105 transition' onClick={handleLogOut}>
        <BiLogOutCircle className='w-[25px] h-[25px] text-white' />
      </div>

      {/* Search Results */}
      {input.length > 0 && (
        <div className='absolute top-[250px] bg-[#1e293b] w-full h-[500px] overflow-y-auto z-50 rounded-xl px-2 py-4 shadow-lg border border-cyan-700'>
          {searchData?.map((user, i) => (
            <div
              key={i}
              className='w-full h-[70px] flex items-center gap-4 px-4 py-2 hover:bg-cyan-800 rounded-lg cursor-pointer transition'
              onClick={() => {
                dispatch(setSelectedUser(user))
                setInput("")
                setSearch(false)
              }}
            >
              <div className='relative'>
                <div className='w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-cyan-400 shadow-md'>
                  <img src={user.image || dp} alt="" className='h-full object-cover' />
                </div>
                {onlineUsers?.includes(user._id) &&
                  <span className='w-[12px] h-[12px] rounded-full absolute bottom-1 right-0 bg-green-400 border-2 border-white'></span>}
              </div>
              <h1 className='text-lg font-semibold'>{user.name || user.userName}</h1>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className='w-full h-[300px] bg-gradient-to-br from-cyan-700 to-blue-800 rounded-b-[30%] px-6 py-6 shadow-lg flex flex-col justify-between'>
        <h1 className='text-white text-3xl font-bold tracking-wide'>chatly</h1>
        <div className='flex justify-between items-center'>
          <h1 className='text-xl font-semibold'>Hi, {userData.name || "User"}</h1>
          <div className='w-[60px] h-[60px] rounded-full overflow-hidden bg-white cursor-pointer shadow-md' onClick={() => navigate("/profile")}>
            <img src={userData.image || dp} alt="" className='h-full object-cover' />
          </div>
        </div>

        {/* Search Input or Icon */}
        <div className='w-full mt-4'>
          {!search ? (
            <div className='w-[60px] h-[60px] rounded-full bg-white flex justify-center items-center cursor-pointer shadow-md' onClick={() => setSearch(true)}>
              <IoIosSearch className='w-6 h-6 text-black' />
            </div>
          ) : (
            <form className='flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-md'>
              <IoIosSearch className='w-6 h-6 text-gray-600' />
              <input
                type="text"
                placeholder='Search users...'
                className='flex-1 bg-transparent text-black text-sm outline-none'
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <RxCross2 className='w-5 h-5 text-black cursor-pointer' onClick={() => setSearch(false)} />
            </form>
          )}
        </div>
      </div>

      {/* Online Users */}
      {!search && (
        <div className='w-full px-4 mt-4 flex items-center gap-3 overflow-x-auto'>
          {otherUsers?.filter(user => onlineUsers?.includes(user._id)).map((user, i) => (
            <div
              key={i}
              className='relative w-[60px] h-[60px] rounded-full bg-white overflow-hidden shadow-md cursor-pointer hover:scale-105 transition'
              onClick={() => dispatch(setSelectedUser(user))}
            >
              <img src={user.image || dp} alt="" className='h-full w-full object-cover' />
              <span className='absolute bottom-1 right-0 w-[12px] h-[12px] bg-green-400 border-2 border-white rounded-full'></span>
            </div>
          ))}
        </div>
      )}

      {/* All Users */}
      <div className='w-full mt-6 h-[50%] overflow-y-auto px-4 flex flex-col gap-3'>
        {otherUsers?.map((user, i) => (
          <div
            key={i}
            className='flex items-center gap-4 p-3 rounded-xl bg-[#1e293b] hover:bg-cyan-800 shadow-md cursor-pointer transition'
            onClick={() => dispatch(setSelectedUser(user))}
          >
            <div className='relative'>
              <div className='w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-cyan-400 shadow-md'>
                <img src={user.image || dp} alt="" className='h-full object-cover' />
              </div>
              {onlineUsers?.includes(user._id) &&
                <span className='w-[12px] h-[12px] rounded-full absolute bottom-1 right-0 bg-green-400 border-2 border-white'></span>}
            </div>
            <h1 className='text-white text-lg font-medium'>{user.name || user.userName}</h1>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SideBar
