import React, { useEffect, useState } from "react";
import { View, Image, ActivityIndicator, Alert, ScrollView, Text, Platform, SafeAreaView, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Constants from "expo-constants";

export default function App() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [images, setImages] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // Cloudinary bilgini buraya yaz
  const CLOUD_NAME = "dycbgxuxa"; // 👈 kendi Cloudinary Cloud Name'inle değiştir
  const UPLOAD_PRESET = "image-upload"; // birazdan oluşturacağız

  // SERVER_URL: change if your device/emulator needs a different host.
  // - On Android emulator: use http://10.0.2.2:5000
  // - On iOS simulator: use http://localhost:5000
  // - On a physical device: use your PC's local IP (e.g. http://192.168.x.x:5000)
  const resolveServerUrl = () => {
    // 1️⃣ Ortam değişkeni varsa (örneğin .env veya app.config.js içinden)
    const envServerUrl =
      process.env.EXPO_PUBLIC_SERVER_URL ??
      Constants.expoConfig?.extra?.serverUrl ??
      Constants.manifest?.extra?.serverUrl;
    if (envServerUrl) return envServerUrl;
  
    // 2️⃣ Android emülatörü için özel IP
    if (Platform.OS === "android") {
      // Android Studio emülatörü için
      return "http://10.0.2.2:5000";
    }
  
    // 3️⃣ iOS için - Tunnel modunda bile gerçek IP kullanılmalı
    if (Platform.OS === "ios") {
      // iOS Simulator için localhost kontrolü
      if (__DEV__) {
        const expoHost = Constants.expoConfig?.hostUri ?? Constants.manifest?.debuggerHost;
        if (expoHost) {
          const host = expoHost.split(":")[0];
          // exp.direct gibi tunnel URL'lerini algıla ve gerçek IP kullan
          if (host && host.includes("exp.direct")) {
            // Tunnel modunda - gerçek IP kullan
            return "http://192.168.1.41:5000";
          }
          // Eğer bilgisayarın IP'si gibi görünüyorsa (ör. 192.168.x.x)
          if (host && !["127.0.0.1", "localhost"].includes(host) && !host.includes("exp.direct")) {
            return `http://${host}:5000`;
          }
        }
      }
      // Gerçek iPhone cihazı için (tunnel modunda bile) manuel IP
      return "http://192.168.1.41:5000";
    }
  
    // 4️⃣ Varsayılan (fiziksel cihazlar için)
    return "http://192.168.1.41:5000";
  };
  
  const SERVER_URL = resolveServerUrl();
  console.log("Resolved SERVER_URL:", SERVER_URL);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const fetchImages = async () => {
    setLoadingList(true);
    try {
      console.log("Fetching from:", `${SERVER_URL}/images`);
      const res = await fetch(`${SERVER_URL}/images`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Response data:", data);
      
      if (data.images && Array.isArray(data.images)) {
        setImages(data.images);
        console.log(`Başarıyla ${data.images.length} görsel yüklendi.`);
      } else {
        console.warn("Beklenmeyen veri formatı:", data);
        Alert.alert("Uyarı", "Sunucudan resim alınamadı veya format hatalı.");
      }
    } catch (err) {
      console.error("fetchImages error:", err);
      const errorMessage = err.message || "Bilinmeyen hata";
      Alert.alert(
        "Hata", 
        `Sunucuya bağlanılamadı.\n\nURL: ${SERVER_URL}/images\n\nHata: ${errorMessage}\n\nLütfen:\n- Server'ın çalıştığından emin olun\n- Cihazın aynı Wi-Fi ağında olduğunu kontrol edin\n- Firewall'ın 5000 portunu engellemediğinden emin olun`
      );
    } finally {
      setLoadingList(false);
    }
  };

  const uploadImage = async () => {
    if (!image) return;
    setUploading(true);

    const data = new FormData();
    data.append("file", { uri: image, type: "image/jpeg", name: "upload.jpg" });
    data.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        data
      );
      setUploadedUrl(res.data.secure_url);
      Alert.alert("Başarılı", "Görsel Cloudinary'ye yüklendi!");
    } catch (err) {
      console.error(err);
      Alert.alert("Hata", "Yükleme başarısız oldu.");
    } finally {
      setUploading(false);
    }
  };
  
  useEffect(() => {
    fetch(`${SERVER_URL}/images`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Sunucudan çekilen veriler:", data);
        if (data?.images) setImages(data.images);
      })
      .catch((err) => {
        console.error("Veri çekme hatası:", err);
      })
  }, [])
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Cloudinary Upload</Text>
          <Text style={styles.subtitle}>Görsellerinizi yükleyin ve yönetin</Text>
        </View>

        {/* Upload Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fotoğraf Yükle</Text>
          
          <TouchableOpacity
            onPress={pickImage}
            style={styles.primaryButton}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>📷 Fotoğraf Seç</Text>
          </TouchableOpacity>

          {image && (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: image }} 
                style={styles.previewImage}
                resizeMode="cover"
              />
              
              <TouchableOpacity
                onPress={uploadImage}
                disabled={!image || uploading}
                style={[
                  styles.uploadButton,
                  (!image || uploading) && styles.uploadButtonDisabled
                ]}
                activeOpacity={0.7}
              >
                {uploading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>Yükleniyor...</Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>☁️ Cloudinary'ye Yükle</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {uploadedUrl && (
            <View style={styles.successCard}>
              <Image 
                source={{ uri: uploadedUrl }} 
                style={styles.uploadedImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => {
                  console.log(uploadedUrl);
                  Alert.alert("Yüklenen Görsel URL'si", uploadedUrl);
                }}
                style={styles.secondaryButton}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>🔗 URL'yi Göster</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* List Images Section */}
        <View style={styles.card}>
          <View style={styles.listHeader}>
            <Text style={styles.cardTitle}>Yüklenen Görseller</Text>
            {loadingList && <ActivityIndicator size="small" color="#3b82f6" />}
          </View>

          <TouchableOpacity
            onPress={fetchImages}
            disabled={loadingList}
            style={[
              styles.listButton,
              loadingList && styles.listButtonDisabled
            ]}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>
              📋 Yüklenenleri Listele
            </Text>
          </TouchableOpacity>

          {images.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Henüz listelenecek görsel yok.</Text>
            </View>
          ) : (
            <View>
              {images.map((img) => (
                <View key={img.public_id} style={styles.imageCard}>
                  <Image 
                    source={{ uri: img.secure_url }} 
                    style={styles.listImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.imageName} numberOfLines={1}>
                    {img.public_id}
                  </Text>
                  {img.format && (
                    <Text style={styles.imageInfo}>
                      {img.format.toUpperCase()} • {img.width}x{img.height}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff6ff', // bg-blue-50
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1f2937', // text-gray-800
    marginBottom: 8,
  },
  subtitle: {
    color: '#4b5563', // text-gray-600
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#3b82f6', // bg-blue-500
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#10b981', // bg-green-500
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 8,
    alignItems: 'center',
  },
  uploadButtonDisabled: {
    backgroundColor: '#d1d5db', // bg-gray-300
  },
  secondaryButton: {
    backgroundColor: '#6366f1', // bg-indigo-500
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  listButton: {
    backgroundColor: '#a855f7', // bg-purple-500
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  listButtonDisabled: {
    backgroundColor: '#d1d5db', // bg-gray-300
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  previewImage: {
    width: 256,
    height: 256,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#bfdbfe', // border-blue-200
  },
  successCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0fdf4', // bg-green-50
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bbf7d0', // border-green-200
  },
  uploadedImage: {
    width: '100%',
    height: 192,
    borderRadius: 12,
    marginBottom: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#9ca3af', // text-gray-400
    textAlign: 'center',
  },
  imageCard: {
    backgroundColor: '#f9fafb', // bg-gray-50
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb', // border-gray-200
  },
  listImage: {
    width: '100%',
    height: 192,
    borderRadius: 8,
    marginBottom: 12,
  },
  imageName: {
    color: '#374151', // text-gray-700
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  imageInfo: {
    color: '#6b7280', // text-gray-500
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
