import React, { useRef, useState } from 'react';
import dp from "../assets/dp.webp";
import { IoCameraOutline } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../main';
import { setUserData } from '../redux/userSlice';
import { toast } from 'react-hot-toast';

function Profile() {
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(userData?.name || "");
  const [frontendImage, setFrontendImage] = useState(userData?.image || dp);
  const [backendImage, setBackendImage] = useState(null);
  const image = useRef();
  const [saving, setSaving] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return toast.error("No file selected.");

    if (!file.type.startsWith("image/")) {
      return toast.error("Please select a valid image file.");
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image size should be less than 5MB.");
    }

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    const toastId = toast.loading("Saving...");

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (backendImage) formData.append("image", backendImage);

      const { data } = await axios.put(`${serverUrl}/api/user/profile`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      dispatch(setUserData(data));
      toast.success("Profile updated!", { id: toastId });
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='w-full h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white flex flex-col justify-center items-center relative'>

      {/* Glowing animated blobs */}
      <div className='absolute w-[300px] h-[300px] bg-[#20c7ff] opacity-30 rounded-full blur-[120px] animate-pulse top-[-100px] left-[-100px]' />
      <div className='absolute w-[300px] h-[300px] bg-[#9333ea] opacity-30 rounded-full blur-[120px] animate-pulse bottom-[-100px] right-[-100px]' />

      <div className='fixed top-[20px] left-[20px] cursor-pointer' onClick={() => navigate("/")}>
        <IoIosArrowRoundBack className='w-[50px] h-[50px] text-white hover:scale-110 transition-all duration-200' />
      </div>

      {/* Profile Image */}
      <div className='relative bg-white/10 backdrop-blur-md rounded-full border-4 border-[#20c7ff] shadow-xl p-2 hover:scale-105 transition-all duration-300 cursor-pointer' onClick={() => image.current.click()}>
        <div className='w-[200px] h-[200px] rounded-full overflow-hidden flex justify-center items-center'>
          <img src={frontendImage} alt="profile" className='h-full w-full object-cover' onError={(e) => { e.target.src = dp }} />
        </div>
        <div className='absolute bottom-4 right-4 w-[35px] h-[35px] rounded-full bg-[#20c7ff] flex justify-center items-center shadow-lg'>
          <IoCameraOutline className='text-black w-[20px] h-[20px]' />
        </div>
      </div>

      {/* Form */}
      <form className='w-[95%] max-w-[500px] flex flex-col gap-[20px] items-center justify-center mt-6' onSubmit={handleProfile}>
        <input type="file" accept='image/*' ref={image} hidden onChange={handleImage} />

        <input
          type="text"
          placeholder="Enter your name"
          className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg shadow-lg text-white placeholder-gray-400 text-[18px]'
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
          minLength={3}
        />

        <input
          type="text"
          readOnly
          className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg shadow-lg text-gray-300 text-[18px]'
          value={userData?.userName || ""}
          placeholder="Username"
        />

        <input
          type="email"
          readOnly
          className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg shadow-lg text-gray-300 text-[18px]'
          value={userData?.email || ""}
          placeholder="Email"
        />

        <button
          type='submit'
          className={`px-6 py-2 rounded-xl shadow-lg text-[18px] font-semibold transition-all duration-200 ${saving ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#20c7ff] hover:bg-[#1ba9d8]'}`}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
