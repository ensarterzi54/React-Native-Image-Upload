import axios from 'axios';

// Cloudinary bilgini buraya yaz
const CLOUD_NAME = "dycbgxuxa"; // 👈 kendi Cloudinary Cloud Name'inle değiştir
const UPLOAD_PRESET = "image-upload"; // birazdan oluşturacağız

export const uploadImageToCloudinary = async (imageUri) => {
  const data = new FormData();
  data.append("file", { uri: imageUri, type: "image/jpeg", name: "upload.jpg" });
  data.append("upload_preset", UPLOAD_PRESET);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    data
  );
  
  return res.data.secure_url;
};

