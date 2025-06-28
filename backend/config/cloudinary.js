import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer (from multer memoryStorage)
 * @returns {Promise<string>} - Secure URL of uploaded image
 */
const uploadOnCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) return reject("No file buffer provided");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'user_profiles',
        resource_type: 'auto', // auto-detect image/video
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }

        if (!result || !result.secure_url) {
          return reject("No URL returned from Cloudinary");
        }

        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export default uploadOnCloudinary;
