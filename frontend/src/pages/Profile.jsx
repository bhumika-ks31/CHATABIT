import React, { useRef, useState } from 'react';
import dp from "../assets/dp.webp";
import { IoCameraOutline } from "react-icons/io5";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../main';
import { setUserData } from '../redux/UserSlice';
import { toast } from 'react-hot-toast';

function Profile() {
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(userData?.name || "");
  const [frontendImage, setFrontendImage] = useState(userData?.image || dp);
  const [backendImage, setBackendImage] = useState(null);
  const imageInput = useRef();
  const [saving, setSaving] = useState(false);

  // Handle image selection and preview
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return toast.error("No file selected.");
    if (!file.type.startsWith("image/")) return toast.error("Please select a valid image file.");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image size should be less than 5MB.");

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  // Handle profile save
  const handleSave = async () => {
    if (!name) return toast.error("Name is required.");
    if (!backendImage) return toast.error("Please select an image.");

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("avatar", backendImage);

      const { data } = await axios.put(
        `${serverUrl}/api/user/profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userData.token}` // required if backend expects token
          },
        }
      );

      dispatch(setUserData(data.user));
      toast.success("Profile updated successfully!");
      navigate("/home");
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page flex flex-col items-center justify-center p-4">
      {/* Back Button */}
      <div className="self-start mb-4 cursor-pointer" onClick={() => navigate(-1)}>
        <IoIosArrowRoundBack size={30} />
      </div>

      {/* Profile Image */}
      <div className="relative mb-4">
        <img
          src={frontendImage}
          alt="profile"
          className="w-32 h-32 rounded-full object-cover border-2 border-gray-400"
          onClick={() => imageInput.current.click()}
        />
        <div className="absolute bottom-0 right-0 cursor-pointer">
          <IoCameraOutline size={25} />
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={imageInput}
          onChange={handleImage}
        />
      </div>

      {/* Name Input */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="border p-2 rounded w-64 mb-4 text-black"
      />

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`px-6 py-2 rounded ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}

export default Profile;
