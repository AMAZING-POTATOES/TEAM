/**
 * Recipe Type Adapter Utilities
 *
 * API와 UI 간의 타입 변환을 위한 유틸리티 함수들
 */

/**
 * API의 난이도를 한국어로 변환
 */
export function mapDifficultyToKorean(
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
): "쉬움" | "보통" | "어려움" {
  const map = {
    'EASY': "쉬움" as const,
    'MEDIUM': "보통" as const,
    'HARD': "어려움" as const
  };
  return map[difficulty];
}

/**
 * 한국어 난이도를 API 형식으로 변환
 */
export function mapDifficultyToEnglish(
  level: "쉬움" | "보통" | "어려움"
): 'EASY' | 'MEDIUM' | 'HARD' {
  const map = {
    "쉬움": 'EASY' as const,
    "보통": 'MEDIUM' as const,
    "어려움": 'HARD' as const
  };
  return map[level];
}

/**
 * 카테고리를 영어로 변환 (필요시 사용)
 */
export function mapCategoryToEnglish(category: string): string {
  const map: Record<string, string> = {
    "한식": "KOREAN",
    "중식": "CHINESE",
    "양식": "WESTERN",
    "일식": "JAPANESE",
    "디저트": "DESSERT",
    "기타": "ETC"
  };
  return map[category] || category;
}

/**
 * 영어 카테고리를 한국어로 변환 (필요시 사용)
 */
export function mapCategoryToKorean(category: string): string {
  const map: Record<string, string> = {
    "KOREAN": "한식",
    "CHINESE": "중식",
    "WESTERN": "양식",
    "JAPANESE": "일식",
    "DESSERT": "디저트",
    "ETC": "기타"
  };
  return map[category] || category;
}
