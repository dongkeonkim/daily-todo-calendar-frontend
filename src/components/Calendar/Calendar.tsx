import React, { useMemo, useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { CalendarItem, TaskStats } from '@/types';
import {
  getColor,
  getDaysOfYear,
  getDateString,
  getISODateString,
  getColorClass,
  getFirstDayOfMonth,
  getDaysInMonth,
} from '@/utils/calendarUtils';
import { useTheme } from '@/contexts/ThemeContext';

interface CalendarProps {
  contributions: CalendarItem[];
  years: string[];
  currentYear: number | null;
  currentMonth: number | null;
  currentDate: string | null;
  taskStats: TaskStats;
  onDateChange: (
    year: string | number | null,
    month: number | null,
    date: string | null
  ) => void;
}

/**
 * 할일 달성 현황을 시각화하는 캘린더 컴포넌트
 */
const Calendar: React.FC<CalendarProps> = ({
  contributions,
  years,
  currentYear,
  currentMonth,
  currentDate,
  taskStats,
  onDateChange,
}) => {
  const { darkMode } = useTheme();
  const [showCalendar, setShowCalendar] = useState<boolean>(true); // 캘린더 표시 여부

  // 월이 '전체' 선택되었을 때 달성 현황을 자동으로 끄는 effect
  useEffect(() => {
    if (currentMonth === null && currentYear !== null) {
      setShowCalendar(false); // 월이 '전체'일 때 달성 현황 끄기
    }
  }, [currentMonth, currentYear]);

  // 월 이름
  const monthNames = [
    '전체',
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  // 요일 레이블
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  // 월 변경 핸들러
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue =
      e.target.value === '0' ? null : parseInt(e.target.value);
    // 연도와 월 변경 시 해당 날짜 정보를 null로 설정
    onDateChange(currentYear, selectedValue, null);
  };

  // 캘린더 표시/숨김 토글 - 월이 '전체'일 때는 토글 비활성화
  const toggleCalendar = () => {
    // 월이 '전체'인 경우 캘린더 표시 불가
    if (currentMonth === null) {
      return;
    }
    setShowCalendar(!showCalendar);
  };

  // 날짜를 클릭했을 때 해당 날짜의 할일 목록으로 이동
  // 같은 날짜를 다시 클릭하면 선택 해제
  const handleClick = async (
    year: number | null,
    month: number | null,
    day: number
  ) => {
    if (year === null || month === null) return;

    const date = `${year}-${String(month).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
    
    // 이미 선택된 날짜를 다시 클릭한 경우, 선택 해제
    if (currentDate === date) {
      onDateChange(year, month, null);
    } else {
      onDateChange(year, month, date);
    }
  };

  // 월별 달력 데이터 생성
  const monthData = useMemo(() => {
    if (currentYear === null) return [];

    // 현재 월이 null(전체)인 경우 현재 달을 기본값으로 표시
    const displayMonth =
      currentMonth === null ? new Date().getMonth() + 1 : currentMonth;

    const firstDayOfMonth = getFirstDayOfMonth(
      currentYear,
      displayMonth as number
    );
    const daysInMonth = getDaysInMonth(currentYear, displayMonth as number);
    let days = [];

    // 첫 주 시작 전 빈 셀 추가
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // 날짜 셀 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${String(displayMonth).padStart(
        2,
        '0'
      )}-${String(day).padStart(2, '0')}`;

      const contribution = contributions.find(
        (c) => c.scheduleDate === dateString
      );

      days.push({
        day,
        successCnt: contribution ? contribution.successCnt : 0,
        totalCnt: contribution ? contribution.totalCnt : 0,
      });
    }

    return days;
  }, [currentYear, currentMonth, contributions]);

  // 달성률 표시를 위한 백분율 계산
  const completionPercentage = useMemo(() => {
    if (taskStats.goalCnt === 0) return 0;
    return (taskStats.successCnt / taskStats.goalCnt) * 100;
  }, [taskStats]);

  return (
    <div className='max-w-5xl mx-auto mb-6'>
      {/* 연도 선택 버튼을 포함한 전체를 하나의 컴포넌트로 설계 */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden'>
        {/* 연도 선택 버튼 */}
        <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex justify-center space-x-2'>
            {years.map((year) => (
              <button
                key={year}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                  year === currentYear?.toString() ||
                  (year === '전체' && currentYear === null)
                    ? `bg-primary-500 text-white shadow-md`
                    : `${
                        darkMode
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-700'
                      } hover:shadow`
                }`}
                onClick={() =>
                  onDateChange(
                    year === '전체' ? null : parseInt(year),
                    null,
                    null
                  )
                }
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {currentYear !== null && (
          <>
            {/* 헤더와 토글 버튼 */}
            <div className='p-4 dark:border-gray-700 flex justify-between items-center'>
              <h2
                className={`text-xl font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}
              >
                {currentYear}년 할일 달성 현황
              </h2>

              <div className='flex items-center space-x-3'>
                {/* 캘린더 토글 버튼 */}
                <button
                  onClick={toggleCalendar}
                  disabled={currentMonth === null} // 월이 '전체'일 때 버튼 비활성화
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                    currentMonth === null
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
                      : showCalendar
                      ? 'bg-primary-500 text-white'
                      : `border ${
                          darkMode
                            ? 'border-gray-600 text-gray-300'
                            : 'border-gray-300 text-gray-700'
                        }`
                  }`}
                >
                  달성 현황 {showCalendar ? '켜짐' : '꺼짐'}
                  {currentMonth === null && ' (월 전체 선택 시 비활성화)'}
                </button>

                {/* 월 선택 드롭다운 */}
                <div
                  className={`inline-block ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  <select
                    value={currentMonth === null ? '0' : currentMonth}
                    onChange={handleMonthChange}
                    className={`appearance-none bg-transparent ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-gray-100 border-gray-300'
                    } border px-3 py-1 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: `right 0.5rem center`,
                      backgroundRepeat: `no-repeat`,
                      backgroundSize: `1.5em 1.5em`,
                      paddingRight: `2.5rem`,
                    }}
                  >
                    {monthNames.map((month, index) => (
                      <option key={index} value={index}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 진행률 표시 바 */}
            <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
              <div className='flex justify-between items-center mb-2'>
                <span
                  className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  진행률
                </span>
                <span
                  className={`font-medium ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {taskStats.successCnt}/{taskStats.goalCnt}
                </span>
              </div>
              <div
                className={`h-3 w-full rounded-full ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                } overflow-hidden`}
              >
                <div
                  className='h-full bg-primary-500 rounded-full transition-all duration-500'
                  style={{
                    width: `${
                      isNaN(completionPercentage) ? 0 : completionPercentage
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* 캘린더 - 토글 상태에 따라 표시/숨김 */}
            {currentMonth === null ? (
              <div className='text-center py-8'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-12 w-12 mx-auto mb-4 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1}
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
                <p
                  className={`text-lg ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  월 전체 선택 시 달성 현황을 볼 수 없습니다.
                </p>
                <p
                  className={`mt-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  특정 월을 선택하시면 달성 현황을 확인할 수 있습니다.
                </p>
              </div>
            ) : showCalendar ? (
              <div className='p-6 animate-fade-in'>
                {/* 요일 헤더 */}
                <div className='grid grid-cols-7 gap-2 mb-2'>
                  {daysOfWeek.map((day, index) => (
                    <div
                      key={day}
                      className={`text-center text-sm font-medium ${
                        index === 0
                          ? 'text-red-500'
                          : darkMode
                          ? 'text-gray-400'
                          : 'text-gray-500'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* 캘린더 그리드 */}
                <div className='grid grid-cols-7 gap-2'>
                  {monthData.map((item, index) => (
                    <div
                      key={index}
                      className={`aspect-square rounded-md flex items-center justify-center ${
                        item === null
                          ? 'invisible'
                          : 'cursor-pointer transform transition-all hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: item
                          ? getColor(item.successCnt, item.totalCnt, darkMode)
                          : 'transparent',
                        // 선택된 날짜일 경우 그라데이션 적용
                        background: item && currentDate === `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`
                          ? `linear-gradient(135deg, ${getColor(item.successCnt, item.totalCnt, darkMode)} 0%, ${darkMode ? '#4f46e5' : '#8b5cf6'} 100%)`
                          : item ? getColor(item.successCnt, item.totalCnt, darkMode) : 'transparent',
                        boxShadow: item && currentDate === `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`
                          ? '0 0 10px rgba(79, 70, 229, 0.6)'
                          : 'none',
                      }}
                      data-tooltip-id={item ? `tooltip-${index}` : undefined}
                      data-tooltip-content={
                        item
                          ? `성공: ${item.successCnt} / 총: ${item.totalCnt}`
                          : undefined
                      }
                      onClick={() =>
                        item && handleClick(currentYear, currentMonth, item.day)
                      }
                    >
                      {item && (
                        <span
                          className={`text-xs font-medium ${
                            darkMode ? 'text-gray-200' : 'text-gray-700'
                          }`}
                        >
                          {item.day}
                        </span>
                      )}
                    </div>
                  ))}

                  {/* 툴팁 */}
                  {monthData.map(
                    (item, index) =>
                      item && (
                        <Tooltip
                          key={`tooltip-${index}`}
                          id={`tooltip-${index}`}
                          place='top'
                          className={
                            darkMode
                              ? 'bg-gray-800 text-white'
                              : 'bg-white text-gray-800'
                          }
                        />
                      )
                  )}
                </div>

                {/* 범례 */}
                <div className='mt-6 flex items-center justify-center space-x-4'>
                  <div className='flex items-center'>
                    <div
                      className='w-3 h-3 rounded-sm mr-1'
                      style={{ backgroundColor: getColor(0, 1, darkMode) }}
                    ></div>
                    <span
                      className={`text-xs ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      없음
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <div
                      className='w-3 h-3 rounded-sm mr-1'
                      style={{ backgroundColor: getColor(1, 4, darkMode) }}
                    ></div>
                    <span
                      className={`text-xs ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      25%
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <div
                      className='w-3 h-3 rounded-sm mr-1'
                      style={{ backgroundColor: getColor(1, 2, darkMode) }}
                    ></div>
                    <span
                      className={`text-xs ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      50%
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <div
                      className='w-3 h-3 rounded-sm mr-1'
                      style={{ backgroundColor: getColor(3, 4, darkMode) }}
                    ></div>
                    <span
                      className={`text-xs ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      75%
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <div
                      className='w-3 h-3 rounded-sm mr-1'
                      style={{ backgroundColor: getColor(1, 1, darkMode) }}
                    ></div>
                    <span
                      className={`text-xs ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      100%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className='text-center py-8'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-12 w-12 mx-auto mb-4 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1}
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
                <p
                  className={`text-lg ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  달성 현황이 꺼져 있습니다.
                </p>
                <p
                  className={`mt-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  버튼을 클릭하여 달성 현황을 확인하세요.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Calendar;
