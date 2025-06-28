import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../main'
import { useDispatch } from 'react-redux'
import { setSelectedUser, setUserData } from '../redux/userSlice'

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/auth/login`, {
        email, password
      }, { withCredentials: true });

      dispatch(setUserData(result.data));
      dispatch(setSelectedUser(null));
      navigate("/");
      setEmail("");
      setPassword("");
      setErr("");
    } catch (error) {
      console.log(error);
      setErr(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='w-full h-[100vh] bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center relative overflow-hidden'>

      {/* animated background blobs */}
      <div className='absolute w-[300px] h-[300px] bg-[#20c7ff] opacity-30 rounded-full blur-[120px] animate-pulse top-[-100px] left-[-100px]' />
      <div className='absolute w-[300px] h-[300px] bg-[#9333ea] opacity-30 rounded-full blur-[120px] animate-pulse bottom-[-100px] right-[-100px]' />

      <div className='w-full max-w-[500px] h-[600px] bg-white/10 backdrop-blur-md rounded-xl shadow-xl flex flex-col gap-[30px] border border-[#20c7ff]'>
        <div className='w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-md flex items-center justify-center'>
          <h1 className='text-white font-bold text-[30px]'>Login to <span className='text-black'>chatly</span></h1>
        </div>
        <form className='w-full flex flex-col gap-[20px] items-center px-4' onSubmit={handleLogin}>

          <input
            type="email"
            placeholder='Email'
            className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-4 py-2 bg-white/10 text-white rounded-lg shadow-lg placeholder-gray-400 text-[18px]'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />

          <div className='w-[90%] h-[50px] border-2 border-[#20c7ff] rounded-lg shadow-lg relative'>
            <input
              type={show ? "text" : "password"}
              placeholder='Password'
              className='w-full h-full outline-none px-4 py-2 bg-white/10 text-white placeholder-gray-400 text-[18px]'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <span
              className='absolute top-[10px] right-[20px] text-[16px] text-[#20c7ff] font-semibold cursor-pointer'
              onClick={() => setShow(prev => !prev)}
            >
              {show ? "Hide" : "Show"}
            </span>
          </div>

          {err && <p className='text-red-400 text-sm text-center'>* {err}</p>}

          <button
            className='px-6 py-2 bg-[#20c7ff] rounded-xl shadow-lg text-[18px] font-semibold hover:bg-[#1ba9d8] transition-all duration-200 mt-4'
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className='text-white cursor-pointer mt-2' onClick={() => navigate("/signup")}>
            Don’t have an account? <span className='text-[#20c7ff] font-semibold'>Sign up</span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
