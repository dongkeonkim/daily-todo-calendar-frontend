import React, { useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { CalendarItem, TaskStats } from '@/types';
import {
  getColor,
  getDaysOfYear,
  getDateString,
  getISODateString,
} from '@/utils/calendarUtils';

interface CalendarProps {
  contributions: CalendarItem[];
  years: string[];
  currentYear: number | null;
  taskStats: TaskStats;
  onDateChange: (year: string | number | null, date: string | null) => void;
}

/**
 * 할일 달성 현황을 시각화하는 캘린더 컴포넌트
 */
const Calendar: React.FC<CalendarProps> = ({
  contributions,
  years,
  currentYear,
  taskStats,
  onDateChange,
}) => {
  // 날짜를 클릭했을 때 해당 날짜의 할일 목록으로 이동
  const handleClick = async (year: number | null, index: number) => {
    if (year === null) return;

    const date = getISODateString(year, index);
    onDateChange(year, date);
  };

  // 현재 선택된 연도의 일 수와 주 수 계산
  const { daysInYear, weeks } = useMemo(() => {
    if (currentYear === null) {
      return { daysInYear: 0, weeks: 0 };
    }
    const days = getDaysOfYear(currentYear);
    return {
      daysInYear: days,
      weeks: Math.ceil(days / 7),
    };
  }, [currentYear]);

  // 셀 크기 정의
  const cellSize = '14px';

  // 날짜 셀 기본 스타일
  const dayStyle = {
    width: cellSize,
    height: cellSize,
    border: '1px solid #e1e4e8',
    backgroundColor: '#ebedf0',
    justifySelf: 'center',
    alignSelf: 'center',
    cursor: 'pointer',
  };

  // 달성률 표시를 위한 백분율 계산
  const completionPercentage = useMemo(() => {
    if (taskStats.goalCnt === 0) return 0;
    return (taskStats.successCnt / taskStats.goalCnt) * 100;
  }, [taskStats]);

  return (
    <>
      {/* 연도 선택 버튼 */}
      <div className='flex justify-center space-x-2 pt-4 pb-2'>
        {years.map((year) => (
          <button
            key={year}
            className={`text-base p-1 rounded-sm border ${
              year === currentYear?.toString() ||
              (year === '전체' && currentYear === null)
                ? 'bg-black text-white'
                : 'hover:bg-gray-200 transition-colors'
            }`}
            onClick={() =>
              onDateChange(year === '전체' ? null : parseInt(year), null)
            }
          >
            {year}
          </button>
        ))}
      </div>

      {currentYear !== null && (
        <>
          {/* 진행률 표시 바 */}
          <div className='flex justify-center p-1'>
            <div className='w-full max-w-lg bg-white'>
              <div className='relative bg-black rounded-full h-4 mb-2'>
                <div
                  className='absolute top-0 left-0 bg-green-500 h-4 rounded-full transition-all duration-500'
                  style={{
                    width: `${
                      isNaN(completionPercentage) ? 0 : completionPercentage
                    }%`,
                  }}
                ></div>
                <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
                  <span className='text-white font-semibold text-sm'>
                    {taskStats.successCnt}/{taskStats.goalCnt}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 캘린더 그리드 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${weeks}, ${cellSize})`,
              gridAutoRows: cellSize,
              gap: '5px',
              width: '80%',
              margin: '0 auto',
              paddingBottom: '5px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {Array.from({ length: weeks }).map((_, weekIndex) =>
              Array.from({ length: 7 }).map((_, dayIndex) => {
                const index = weekIndex * 7 + dayIndex;
                if (index >= daysInYear) return null;

                const dateString = getDateString(currentYear, index);
                const isoDateString = getISODateString(currentYear, index);

                const contribution = contributions.find((c) => {
                  return c.scheduleDate === isoDateString;
                });

                const successCnt = contribution ? contribution.successCnt : 0;
                const totalCnt = contribution ? contribution.totalCnt : 0;

                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    style={{
                      ...dayStyle,
                      backgroundColor: getColor(successCnt, totalCnt),
                    }}
                    data-tooltip-id={`tooltip-${index}`}
                    data-tooltip-content={`${dateString}, ${successCnt}/${totalCnt}`}
                    onClick={() => handleClick(currentYear, index)}
                  />
                );
              })
            )}

            {/* 툴팁 */}
            {Array.from({ length: daysInYear }).map((_, index) => (
              <Tooltip
                key={`tooltip-${index}`}
                id={`tooltip-${index}`}
                place='top'
                // effect='solid'
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Calendar;
