import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Button = ({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false,
  variant = 'primary', // primary, secondary, outline
  size = 'medium', // small, medium, large
  style,
  textStyle 
}) => {
  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return ['#667eea', '#764ba2'];
      case 'secondary':
        return ['#f093fb', '#f5576c'];
      case 'outline':
        return ['transparent', 'transparent'];
      default:
        return ['#667eea', '#764ba2'];
    }
  };

  const buttonSize = {
    small: { paddingVertical: 8, paddingHorizontal: 16 },
    medium: { paddingVertical: 14, paddingHorizontal: 28 },
    large: { paddingVertical: 18, paddingHorizontal: 36 }
  };

  const textSize = {
    small: 14,
    medium: 16,
    large: 18
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.container, style]}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          buttonSize[size],
          variant === 'outline' && styles.outline,
          (disabled || loading) && styles.disabled
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text 
            style={[
              styles.text, 
              { fontSize: textSize[size] },
              variant === 'outline' && styles.outlineText,
              textStyle
            ]}
          >
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  outline: {
    borderWidth: 2,
    borderColor: '#667eea',
  },
  outlineText: {
    color: '#667eea',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
