import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

export const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Cloudinary Upload</Text>
      <Text style={styles.subtitle}>Görsellerinizi yükleyin ve yönetin</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

