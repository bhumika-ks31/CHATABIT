import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../main'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function SignUp() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [show, setShow] = useState(false)
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signup`, {
        userName, email, password
      }, { withCredentials: true })

      dispatch(setUserData(result.data))
      navigate("/profile")
      setEmail("")
      setPassword("")
      setUserName("")
      setErr("")
    } catch (error) {
      console.log(error)
      setErr(error?.response?.data?.message || "Signup failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden px-4">
      {/* 🔥 Animated Particle Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-gray-900 animate-gradient-xy opacity-30 z-0" />

      {/* 🔥 Glass card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl shadow-2xl p-8 space-y-6 z-10 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-center">
          Welcome to <span className="text-[#20c7ff]">Chatly</span>
        </h1>

        <form onSubmit={handleSignUp} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#20c7ff] focus:outline-none focus:ring-2 focus:ring-[#20c7ff] text-white placeholder-gray-400"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-black/30 border border-[#20c7ff] focus:outline-none focus:ring-2 focus:ring-[#20c7ff] text-white placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-3 pr-12 rounded-lg bg-black/30 border border-[#20c7ff] focus:outline-none focus:ring-2 focus:ring-[#20c7ff] text-white placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute top-3.5 right-4 text-[#20c7ff] cursor-pointer"
              onClick={() => setShow(!show)}
            >
              {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>

          {err && <p className="text-red-400 text-sm">* {err}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#20c7ff] hover:bg-[#1ab2e6] text-white font-semibold py-3 rounded-lg transition duration-200 ease-in-out shadow-md hover:shadow-lg"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-gray-300">
            Already have an account?{" "}
            <span
              className="text-[#20c7ff] font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default SignUp
