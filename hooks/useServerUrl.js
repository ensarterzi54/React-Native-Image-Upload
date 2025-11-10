import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const useServerUrl = () => {
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
  
  return resolveServerUrl();
};

