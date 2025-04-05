/**
 * 특정 연도의 총 일수를 계산
 * @param year 연도
 * @returns 일수
 */
export const getDaysOfYear = (year: number): number => {
  let count = 0;
  const startDate = new Date(year, 0, 1); // 1월 1일
  const endDate = new Date(year + 1, 0, 1); // 다음 해 1월 1일

  for (
    let date = new Date(startDate);
    date < endDate;
    date.setDate(date.getDate() + 1)
  ) {
    count++;
  }

  return count;
};

/**
 * 인덱스 기반으로 표시할 날짜 문자열 반환
 * @param currentYear 연도
 * @param index 해당 연도의 일 수 인덱스 (0부터 시작)
 * @returns 형식화된 날짜 문자열 (예: "1월 1일")
 */
export const getDateString = (currentYear: number, index: number): string => {
  const startDate = new Date(currentYear, 0, 1);
  const currentDate = new Date(startDate);
  currentDate.setDate(startDate.getDate() + index);
  return currentDate.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });
};

/**
 * 인덱스 기반으로 ISO 형식 날짜 문자열 반환
 * @param currentYear 연도
 * @param index 해당 연도의 일 수 인덱스 (0부터 시작)
 * @returns ISO 형식 날짜 문자열 (예: "2025-01-01")
 */
export const getISODateString = (
  currentYear: number,
  index: number
): string => {
  const startDate = new Date(currentYear, 0, 1);
  const currentDate = new Date(startDate);
  currentDate.setDate(startDate.getDate() + index);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * 특정 월의 첫날 요일 인덱스 가져오기
 * @param year 연도
 * @param month 월 (1-12)
 * @returns 요일 인덱스 (0: 일요일, 1: 월요일, ...)
 */
export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month - 1, 1).getDay();
};

/**
 * 특정 월의 총 일수 계산
 * @param year 연도
 * @param month 월 (1-12)
 * @returns 해당 월의 총 일수
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

/**
 * 완료율에 따른 색상 클래스 반환
 * @param successCnt 성공 건수
 * @param totalCnt 전체 건수
 * @param isDarkMode 다크모드 여부
 * @returns Tailwind CSS 색상 클래스
 */
export const getColorClass = (
  successCnt: number,
  totalCnt: number,
  isDarkMode: boolean = false
): string => {
  if (totalCnt === 0) return isDarkMode ? 'bg-gray-700' : 'bg-gray-200';

  const ratio = successCnt / totalCnt;

  if (ratio === 1) return isDarkMode ? 'bg-green-600' : 'bg-green-500';
  if (ratio >= 0.8) return isDarkMode ? 'bg-green-700/80' : 'bg-green-400';
  if (ratio >= 0.5) return isDarkMode ? 'bg-green-800/60' : 'bg-green-300';
  if (ratio > 0) return isDarkMode ? 'bg-green-900/40' : 'bg-green-200';

  return isDarkMode ? 'bg-gray-700' : 'bg-gray-200';
};

/**
 * 완료율에 따른 색상 반환 (레거시 지원)
 * @param successCnt 성공 건수
 * @param totalCnt 전체 건수
 * @returns 색상 코드
 */
export const getColor = (
  successCnt: number,
  totalCnt: number,
  darkMode: boolean
): string => {
  if (totalCnt === 0 && darkMode) return '#161b22';
  else if (totalCnt === 0) return '#ebedf0';

  const ratio = successCnt / totalCnt;
  const colorIndex = Math.min(Math.ceil(ratio * 4), 4);

  // 모던한 그린 색상 팔레트
  const colors = ['#ebedf0', '#c6e48b', '#7bc96f', '#49a75b', '#2e8840'];

  return colors[colorIndex];
};
