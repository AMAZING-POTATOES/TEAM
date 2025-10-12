// src/screens/FridgeScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Platform,
  StatusBar
} from 'react-native';
import ItemCard from '../components/ItemCard';
import AddItemSheet, { NewItem } from '../components/AddItemSheet';

// 카테고리별 임시 이미지 (확장자/파일명 정확히!)
import fruitImg from '../assets/cat_fruit.jpg';
import vegiImg from '../assets/cat_vegi.jpg';
import meatImg from '../assets/cat_meat.jpg';

type SortKey = 'createdAt' | 'daysLeft';

type Row = {
  id: string;
  title: string;
  daysLeft: number;
  image: any;
  cat: string;
  createdAt: string; // YYYY-MM-DD
};

// 초기 더미
const initialData: Row[] = [
  { id: '1', title: '사과', daysLeft: 2, image: fruitImg, cat: '채소/과일', createdAt: '2025-10-10' },
  { id: '2', title: '양상추', daysLeft: 3, image: vegiImg, cat: '채소/과일', createdAt: '2025-10-09' },
  { id: '3', title: '삼겹살', daysLeft: 5, image: meatImg, cat: '육류', createdAt: '2025-10-08' },
  { id: '3', title: '삼겹살', daysLeft: 5, image: meatImg, cat: '육류', createdAt: '2025-10-08' }
];

export default function FridgeScreen() {
  // 안전한 상단 여백 (SafeAreaProvider 없어도 동작)
  const topPad = (Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0) + 8;

  // 원본 리스트(여기에 push)
  const [all, setAll] = useState<Row[]>(initialData);

  // 정렬/필터 상태
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortAsc, setSortAsc] = useState(true);
  const [selCats, setSelCats] = useState<string[]>([]);
  const [expireState, setExpireState] = useState<'임박' | '충분' | null>(null);
  const [regDate, setRegDate] = useState<'오늘' | '이번주' | null>(null);

  // 모달들
  const [sheetVisible, setSheetVisible] = useState(false); // 정렬/필터 시트
  const [addOpen, setAddOpen] = useState(false); // 새 재고 추가 시트

  // 목록 가공
  const data = useMemo(() => {
    let list = [...all];

    if (selCats.length) list = list.filter(i => selCats.includes(i.cat));
    if (expireState === '임박') list = list.filter(i => i.daysLeft <= 2);
    if (expireState === '충분') list = list.filter(i => i.daysLeft > 2);
    if (regDate) {
      const now = new Date();
      if (regDate === '오늘') {
        const today = new Date().toISOString().slice(0, 10);
        list = list.filter(i => i.createdAt === today);
      } else {
        list = list.filter(i => now.getTime() - new Date(i.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000);
      }
    }

    list.sort((a, b) => {
      const A = sortKey === 'createdAt' ? +new Date(a.createdAt) : a.daysLeft;
      const B = sortKey === 'createdAt' ? +new Date(b.createdAt) : b.daysLeft;
      return sortAsc ? A - B : B - A;
    });

    return list;
  }, [all, selCats, expireState, regDate, sortKey, sortAsc]);

  // 카테고리 → 이미지 매핑 (원하면 교체)
  const getImageByCategory = (cat: string) => {
    if (cat === '채소' || cat === '과일' || cat === '채소/과일') return fruitImg;
    if (cat === '육류') return meatImg;
    if (cat === '해산물') return meatImg;
    if (cat === '유제품') return fruitImg;
    return vegiImg;
  };

  // 남은 일수 계산
  const calcDaysLeft = (expiresAt?: Date | null) => {
    const today = new Date();
    const expires = expiresAt ?? new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    return Math.max(0, Math.ceil((+expires - +today) / (24 * 60 * 60 * 1000)));
  };

  // ③ 저장 로직 정리 — AddItemSheet → 목록에 추가
  const onSaveNewItem = (ni: NewItem) => {
    const row: Row = {
      id: String(Date.now()),
      title: ni.title,
      daysLeft: calcDaysLeft(ni.expiresAt),
      image: getImageByCategory(ni.category),
      cat: ni.category,
      createdAt: (ni.purchasedAt ?? new Date()).toISOString().slice(0, 10),
    };
    setAll(prev => [row, ...prev]);  // 원본 리스트에 추가
  };

  // 정렬/필터 칩 UI
  const Chip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>냉장고</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setAddOpen(true)}>
          <Text style={{ color: 'white', fontSize: 28, lineHeight: 28 }}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* 스캔 영역 */}
      <View style={styles.scanWrap}>
        <View style={styles.scanBox}>
          <Text style={styles.scanTitle}>영수증 스캔하기</Text>
          <Text style={styles.scanDesc}>영수증을 스캔하여 쉽게 입력하세요.</Text>
          <TouchableOpacity style={styles.scanBtn}>
            <Text style={styles.scanBtnText}>🧾  영수증 스캔</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 섹션 헤더 */}
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>나의 냉장고</Text>
        <TouchableOpacity onPress={() => setSheetVisible(true)}>
          <Text style={styles.sortText}>정렬 {sortAsc ? '↑' : '↓'}</Text>
        </TouchableOpacity>
      </View>

      {/* 그리드 목록 */}
      <FlatList
        data={data}
        keyExtractor={i => i.id}
        numColumns={2}
        renderItem={({ item }) => <ItemCard title={item.title} daysLeft={item.daysLeft} image={item.image} />}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />

      {/* 정렬/필터 Bottom Sheet */}
      <Modal visible={sheetVisible} animationType="slide" transparent onRequestClose={() => setSheetVisible(false)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setSheetVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={styles.sheetTitle}>필터 및 정렬</Text>

            <Text style={styles.groupTitle}>정렬</Text>
            <View style={styles.row}>
              <Chip label="등록일자" active={sortKey === 'createdAt'} onPress={() => setSortKey('createdAt')} />
              <Chip label="소비기한" active={sortKey === 'daysLeft'} onPress={() => setSortKey('daysLeft')} />
              <Chip label={sortAsc ? '오름차순' : '내림차순'} active onPress={() => setSortAsc(p => !p)} />
            </View>

            <Text style={styles.groupTitle}>식품 유형</Text>
            <View style={styles.row}>
              {['채소/과일', '육류', '해산물', '유제품'].map(cat => (
                <Chip
                  key={cat}
                  label={cat}
                  active={selCats.includes(cat)}
                  onPress={() =>
                    setSelCats(prev => (prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]))
                  }
                />
              ))}
            </View>

            <Text style={styles.groupTitle}>소비기한 상태</Text>
            <View style={styles.row}>
              <Chip label="임박" active={expireState === '임박'} onPress={() => setExpireState(expireState === '임박' ? null : '임박')} />
              <Chip label="충분" active={expireState === '충분'} onPress={() => setExpireState(expireState === '충분' ? null : '충분')} />
            </View>

            <Text style={styles.groupTitle}>등록일자</Text>
            <View style={styles.row}>
              <Chip label="오늘" active={regDate === '오늘'} onPress={() => setRegDate(regDate === '오늘' ? null : '오늘')} />
              <Chip label="이번주" active={regDate === '이번주'} onPress={() => setRegDate(regDate === '이번주' ? null : '이번주')} />
            </View>

            <View style={styles.sheetButtons}>
              <TouchableOpacity
                style={[styles.btn, styles.btnGhost]}
                onPress={() => {
                  setSelCats([]);
                  setExpireState(null);
                  setRegDate(null);
                  setSortKey('createdAt');
                  setSortAsc(true);
                }}>
                <Text style={[styles.btnText, { color: '#43D35E' }]}>초기화</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => setSheetVisible(false)}>
                <Text style={[styles.btnText, { color: '#fff' }]}>적용</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* 새 재고 추가 시트 */}
      <AddItemSheet visible={addOpen} onClose={() => setAddOpen(false)} onSave={onSaveNewItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F4' },

  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#0E2717' },
  addBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#43D35E',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  scanWrap: { paddingHorizontal: 20, paddingTop: 6 },
  scanBox: {
    borderWidth: 2,
    borderColor: '#A8EFAF',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    backgroundColor: '#F8FFF9',
  },
  scanTitle: { fontSize: 22, fontWeight: '900', color: '#1E3C27', marginTop: 6 },
  scanDesc: { fontSize: 13, color: '#6C766C', marginTop: 6, marginBottom: 12 },
  scanBtn: { backgroundColor: '#46E067', paddingHorizontal: 22, paddingVertical: 12, borderRadius: 26, elevation: 3 },
  scanBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  listHeader: {
    marginTop: 20,
    marginBottom: 6,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0E2717' },
  sortText: { color: '#6C766C', fontWeight: '900' },

  // Bottom sheet
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
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
    maxHeight: '80%',
  },
  sheetHandle: { alignSelf: 'center', width: 56, height: 6, borderRadius: 3, backgroundColor: '#D9F6DE', marginBottom: 8 },
  sheetTitle: { fontSize: 22, fontWeight: '900', color: '#0E2717', marginBottom: 12 },
  groupTitle: { fontSize: 16, fontWeight: '900', color: '#0E2717', marginTop: 12, marginBottom: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 10, rowGap: 10 },

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

  sheetButtons: { flexDirection: 'row', gap: 12, marginTop: 18, marginBottom: 10 },
  btn: { flex: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  btnGhost: { backgroundColor: '#E9F9ED' },
  btnPrimary: { backgroundColor: '#43D35E' },
  btnText: { fontSize: 16, fontWeight: '900' },
});
