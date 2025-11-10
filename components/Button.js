import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../styles/colors';

export const Button = ({ 
  title, 
  onPress, 
  disabled = false, 
  variant = 'primary',
  loading = false,
  style,
  ...props 
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[variant]];
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    if (style) {
      baseStyle.push(style);
    }
    return baseStyle;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={getButtonStyle()}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
      ) : null}
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  success: {
    backgroundColor: colors.success,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  list: {
    backgroundColor: colors.list,
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

