// utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(imagePath) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(imagePath, { folder: 'car-images' }, (error, result) => {
      if (error) return reject(error);
      resolve(result.secure_url); // Return the secure URL for use in your app
    });
  });
}

export default cloudinary;
