import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from './Button';
import { uploadImageToCloudinary } from '../services/cloudinaryService';
import { showSuccess, showError, showUrl } from '../utils/alertUtils';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';

export const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const uploadImage = async () => {
    if (!image) return;
    setUploading(true);

    try {
      const url = await uploadImageToCloudinary(image);
      setUploadedUrl(url);
      showSuccess("Başarılı", "Görsel Cloudinary'ye yüklendi!");
    } catch (err) {
      console.error(err);
      showError("Hata", "Yükleme başarısız oldu.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.cardTitle}>Fotoğraf Yükle</Text>
      
      <Button
        title="📷 Fotoğraf Seç"
        onPress={pickImage}
        variant="primary"
        style={{ marginBottom: 16 }}
      />

      {image && (
        <View style={globalStyles.imageContainer}>
          <Image 
            source={{ uri: image }} 
            style={globalStyles.previewImage}
            resizeMode="cover"
          />
          
          <Button
            title="☁️ Cloudinary'ye Yükle"
            onPress={uploadImage}
            disabled={!image || uploading}
            variant="success"
            loading={uploading}
            style={{ marginBottom: 8 }}
          />
        </View>
      )}

      {uploadedUrl && (
        <View style={globalStyles.successCard}>
          <Image 
            source={{ uri: uploadedUrl }} 
            style={globalStyles.uploadedImage}
            resizeMode="cover"
          />
          <Button
            title="🔗 URL'yi Göster"
            onPress={() => {
              console.log(uploadedUrl);
              showUrl(uploadedUrl);
            }}
            variant="secondary"
          />
        </View>
      )}
    </View>
  );
};

