import axios from "axios";
import { serverUrl } from "../main"; // aapka backend URL

// Get current user
export const getCurrentUser = async (token) => {
  try {
    const { data } = await axios.get(`${serverUrl}/api/user/current`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (err) {
    console.error("getCurrentUser error:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};

// Get other users
export const getOthers = async (token, userId) => {
  try {
    const { data } = await axios.get(`${serverUrl}/api/user/others`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { userId }, // backend expects this
    });
    return data;
  } catch (err) {
    console.error("getOthers error:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};

// Update profile (name + optional image)
export const updateProfile = async (token, name, file) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    if (file) formData.append("file", file); // must match backend multer field name

    const { data } = await axios.put(`${serverUrl}/api/user/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (err) {
    console.error("updateProfile error:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};
