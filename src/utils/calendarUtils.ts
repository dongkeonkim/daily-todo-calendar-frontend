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
 * 완료율에 따른 색상 반환
 * @param successCnt 성공 건수
 * @param totalCnt 전체 건수
 * @returns 색상 코드
 */
export const getColor = (successCnt: number, totalCnt: number): string => {
  if (totalCnt === 0) return '#ebedf0';

  const ratio = successCnt / totalCnt;
  const colorIndex = Math.min(Math.ceil(ratio * 4), 4);
  const colors = ['#ebedf0', '#b8f890', '#a3f66e', '#8df44c', '#78f22b'];

  return colors[colorIndex];
};
