import React from 'react';
import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GoogleButton from '../components/GoogleButton';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleGoogleLogin = () => {
    console.log('google login click'); // ← 로그로 눌림 확인
    // 실제 로그인은 나중에 붙이고, 지금은 바로 홈으로:
    navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7F4" />
      <View style={styles.centerArea}>
        <Image source={require('../assets/potato.png')} style={styles.logo} />
        <Text style={styles.title}>싹난감자</Text>
        <Text style={styles.subtitle}>당신의 냉장고를 위한 똑똑한 파트너</Text>
      </View>
      <View style={[styles.ctaWrap, { bottom: insets.bottom + 40 }]}>
        <GoogleButton onPress={handleGoogleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F4' },
  centerArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  logo: { width: 140, height: 140, marginBottom: 24 },
  title: { fontSize: 40, fontWeight: '800', color: '#0E2717' },
  subtitle: { marginTop: 8, fontSize: 15, color: '#5B645C' },
  ctaWrap: { position: 'absolute', left: 24, right: 24 },
});
