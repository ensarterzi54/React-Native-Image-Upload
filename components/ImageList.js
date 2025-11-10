import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { Button } from './Button';
import { fetchImages } from '../services/apiService';
import { showError, showWarning, showConnectionError } from '../utils/alertUtils';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';
import { useServerUrl } from '../hooks/useServerUrl';

export const ImageList = () => {
  const [images, setImages] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const serverUrl = useServerUrl();

  const loadImages = useCallback(async () => {
    setLoadingList(true);
    try {
      console.log("Fetching from:", `${serverUrl}/images`);
      const data = await fetchImages(serverUrl);
      setImages(data);
      console.log(`Başarıyla ${data.length} görsel yüklendi.`);
    } catch (err) {
      console.error("fetchImages error:", err);
      const errorMessage = err.message || "Bilinmeyen hata";
      if (errorMessage === "Beklenmeyen veri formatı") {
        showWarning("Uyarı", "Sunucudan resim alınamadı veya format hatalı.");
      } else {
        showConnectionError(serverUrl, errorMessage);
      }
    } finally {
      setLoadingList(false);
    }
  }, [serverUrl]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  return (
    <View style={globalStyles.card}>
      <View style={styles.listHeader}>
        <Text style={globalStyles.cardTitle}>Yüklenen Görseller</Text>
        {loadingList && <ActivityIndicator size="small" color={colors.primary} />}
      </View>

      <Button
        title="📋 Yüklenenleri Listele"
        onPress={loadImages}
        disabled={loadingList}
        variant="list"
        loading={loadingList}
        style={{ marginBottom: 16 }}
      />

      {images.length === 0 ? (
        <View style={globalStyles.emptyContainer}>
          <Text style={globalStyles.emptyText}>Henüz listelenecek görsel yok.</Text>
        </View>
      ) : (
        <View>
          {images.map((img) => (
            <View key={img.public_id} style={globalStyles.imageCard}>
              <Image 
                source={{ uri: img.secure_url }} 
                style={globalStyles.listImage}
                resizeMode="cover"
              />
              <Text style={globalStyles.imageName} numberOfLines={1}>
                {img.public_id}
              </Text>
              {img.format && (
                <Text style={globalStyles.imageInfo}>
                  {img.format.toUpperCase()} • {img.width}x{img.height}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});

