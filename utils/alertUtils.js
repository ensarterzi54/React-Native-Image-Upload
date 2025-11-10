import { Alert } from 'react-native';

export const showError = (title, message) => {
  Alert.alert(title, message);
};

export const showSuccess = (title, message) => {
  Alert.alert(title, message);
};

export const showConnectionError = (serverUrl, errorMessage) => {
  Alert.alert(
    "Hata", 
    `Sunucuya bağlanılamadı.\n\nURL: ${serverUrl}/images\n\nHata: ${errorMessage}\n\nLütfen:\n- Server'ın çalıştığından emin olun\n- Cihazın aynı Wi-Fi ağında olduğunu kontrol edin\n- Firewall'ın 5000 portunu engellemediğinden emin olun`
  );
};

export const showWarning = (title, message) => {
  Alert.alert(title, message);
};

export const showUrl = (url) => {
  Alert.alert("Yüklenen Görsel URL'si", url);
};

