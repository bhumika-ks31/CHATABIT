// middlewares/multer.js
import multer from "multer";

// ✅ Store files in memory (not disk) so Cloudinary can use them
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Max file size: 10 MB
  },
});
