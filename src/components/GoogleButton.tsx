import React from 'react';
import {TouchableOpacity, Text, Image, StyleSheet, ViewStyle} from 'react-native';

type Props = { onPress: () => void; style?: ViewStyle; label?: string; };

export default function GoogleButton({onPress, style, label}: Props) {
  return (
    <TouchableOpacity style={[styles.googleButton, style]} onPress={onPress} activeOpacity={0.85}>
      <Image
        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
        style={styles.googleIcon}
      />
      <Text style={styles.googleText}>{label ?? 'Google 계정으로 계속하기'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 28,
    paddingHorizontal: 18, paddingVertical: 12, elevation: 3,
  },
  googleIcon: { width: 22, height: 22, marginRight: 10 },
  googleText: { fontSize: 16, color: '#333', fontWeight: '500' },
});
