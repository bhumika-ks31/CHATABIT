import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

// ✅ Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `current user error: ${error.message}` });
  }
};

// ✅ Edit profile (image optional)
export const editProfile = async (req, res) => {
  try {
    const { name } = req.body;
    let image;

    // If image file is uploaded, upload to Cloudinary
    if (req.file) {
      image = await uploadOnCloudinary(req.file.buffer);
    }

    // Construct only the fields we want to update
    const updateData = { name };
    if (image) updateData.image = image;

    // Update user
    const user = await User.findByIdAndUpdate(req.userId, updateData, { new: true });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("🧨 editProfile error:", error);
    return res.status(500).json({ message: `profile error: ${error.message}` });
  }
};

// ✅ Get all users except current
export const getOtherUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: `get other users error: ${error.message}` });
  }
};

// ✅ Search users by name or username
export const search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
      ],
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: `search users error: ${error.message}` });
  }
};
