import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  title: string;
  daysLeft: number;
  image: any; // require(...)
  onPress?: () => void;
};

export default function ItemCard({ title, daysLeft, image, onPress }: Props) {
  const badgeColor = daysLeft <= 2 ? '#FFB6B6' : daysLeft <= 4 ? '#FFDFA5' : '#E8E8E8';

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <Image source={image} style={styles.img} />
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={[styles.badge, { backgroundColor: badgeColor }]}>
        <Text style={styles.badgeText}>{daysLeft}일 남음</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, height: 160, backgroundColor: '#fff', borderRadius: 18, padding: 12,
    margin: 8, elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
  },
  img: { width: '100%', height: 90, borderRadius: 12, marginBottom: 8, backgroundColor: '#F4F6F3' },
  title: { fontSize: 14, fontWeight: '600', color: '#333' },
  badge: { position: 'absolute', bottom: 10, right: 12, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 12, color: '#7A3D3D', fontWeight: '700' },
});
