// src/components/AddItemSheet.tsx
import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, Pressable, TextInput, ScrollView, Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export type NewItem = {
  title: string;
  qty: string;
  purchasedAt?: Date | null;
  expiresAt?: Date | null;
  storage: '냉장' | '냉동' | '실온';
  category: '채소' | '과일' | '육류' | '해산물' | '유제품' | '기타';
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (item: NewItem) => void;
};

export default function AddItemSheet({ visible, onClose, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [qty, setQty] = useState('');
  const [purchasedAt, setPurchasedAt] = useState<Date | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [storage, setStorage] = useState<NewItem['storage']>('냉장');
  const [category, setCategory] = useState<NewItem['category']>('채소');

  const [showPicker, setShowPicker] = useState<null | 'buy' | 'exp'>(null);

  const onDateChange =
    (type: 'buy' | 'exp') => (e: DateTimePickerEvent, d?: Date) => {
      if (Platform.OS === 'android') setShowPicker(null);
      if (d) {
        if (type === 'buy') setPurchasedAt(d);
        else setExpiresAt(d);
      }
    };

  const fmt = (d?: Date | null) =>
    d
      ? `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(
          2,
          '0',
        )}/${d.getFullYear()}`
      : 'mm/dd/yyyy';

  const reset = () => {
    setTitle('');
    setQty('');
    setPurchasedAt(null);
    setExpiresAt(null);
    setStorage('냉장');
    setCategory('채소');
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      qty,
      purchasedAt,
      expiresAt,
      storage,
      category,
    });
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      {/* 어두운 배경 */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* 바텀시트 */}
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          {/* 헤더 */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>새 재고 추가</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          {/* 항목 이름 */}
          <Text style={styles.label}>항목 이름</Text>
          <TextInput
            placeholder="예: 유기농 계란"
            placeholderTextColor="#9BB09E"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          {/* 수량 */}
          <Text style={styles.label}>수량</Text>
          <TextInput
            placeholder="예: 12개"
            placeholderTextColor="#9BB09E"
            value={qty}
            onChangeText={setQty}
            style={styles.input}
          />

          {/* 날짜 */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>구입 날짜</Text>
              <Pressable style={styles.input} onPress={() => setShowPicker('buy')}>
                <Text style={styles.inputText}>{fmt(purchasedAt)}</Text>
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>유통기한</Text>
              <Pressable style={styles.input} onPress={() => setShowPicker('exp')}>
                <Text style={styles.inputText}>{fmt(expiresAt)}</Text>
              </Pressable>
            </View>
          </View>

          {showPicker === 'buy' && (
            <DateTimePicker
              value={purchasedAt ?? new Date()}
              mode="date"
              onChange={onDateChange('buy')}
            />
          )}
          {showPicker === 'exp' && (
            <DateTimePicker
              value={expiresAt ?? new Date()}
              mode="date"
              onChange={onDateChange('exp')}
            />
          )}

          {/* 보관방법 */}
          <Text style={styles.label}>보관방법</Text>
          <View style={styles.rowChips}>
            {(['냉장', '냉동', '실온'] as const).map(v => (
              <Pressable
                key={v}
                onPress={() => setStorage(v)}
                style={[styles.chip, storage === v && styles.chipActive]}>
                <Text style={[styles.chipText, storage === v && styles.chipTextActive]}>
                  {v}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* 카테고리 */}
          <Text style={styles.label}>카테고리</Text>
          <View style={styles.rowChips}>
            {(['채소', '과일', '육류', '해산물', '유제품', '기타'] as const).map(v => (
              <Pressable
                key={v}
                onPress={() => setCategory(v)}
                style={[styles.chip, category === v && styles.chipActive]}>
                <Text style={[styles.chipText, category === v && styles.chipTextActive]}>
                  {v}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* 삭제(신규에선 비활성) */}
          <Pressable style={styles.deleteBtn} disabled>
            <Text style={{ color: '#9EA8A1', fontWeight: '800' }}>삭제하기</Text>
          </Pressable>

          {/* 하단 버튼 */}
          <View style={styles.footerRow}>
            <Pressable style={[styles.btn, styles.btnGhost]} onPress={onClose}>
              <Text style={[styles.btnText, { color: '#404A43' }]}>취소</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnPrimary]} onPress={handleSave}>
              <Text style={[styles.btnText, { color: 'white' }]}>저장</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: '88%',
  },
  handle: {
    alignSelf: 'center',
    width: 64,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2F5E6',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: { fontSize: 22, fontWeight: '900', color: '#0E2717' },
  close: { fontSize: 22, color: '#30483A', fontWeight: '900' },

  label: { marginTop: 14, marginBottom: 8, fontSize: 14, color: '#263B2E', fontWeight: '900' },
  input: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: '#F3F7F3',
    borderColor: '#E4EFE6',
    borderWidth: 1,
    justifyContent: 'center',
  },
  inputText: { color: '#1E3025', fontSize: 15 },

  rowChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: '#ECFBEF',
    borderWidth: 1,
    borderColor: '#CFF3D3',
  },
  chipActive: { backgroundColor: '#43D35E', borderColor: '#43D35E' },
  chipText: { color: '#2F6B3C', fontWeight: '800' },
  chipTextActive: { color: '#fff' },

  deleteBtn: {
    marginTop: 16,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EFF3F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerRow: { flexDirection: 'row', gap: 12, marginTop: 16, marginBottom: 10 },
  btn: { flex: 1, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  btnGhost: { backgroundColor: '#EAF4EC' },
  btnPrimary: { backgroundColor: '#43D35E' },
  btnText: { fontSize: 17, fontWeight: '900' },
});
