import React from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

function getDaysOfYear(year) {
  let count = 0;
  const startDate = new Date(year, 0, 1); // 1월 1일
  const endDate = new Date(year + 1, 0, 1); // 다음 해 1월 1일

  for (let date = startDate; date < endDate; date.setDate(date.getDate() + 1)) {
    count++;
  }

  return count;
}

const getDateString = (currentYear, index) => {
  const startDate = new Date(currentYear, 0, 1);
  const currentDate = new Date(startDate);
  currentDate.setDate(startDate.getDate() + index);
  return currentDate.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });
};

const getISODateString = (currentYear, index) => {
  const startDate = new Date(currentYear, 0, 1);
  const currentDate = new Date(startDate);
  currentDate.setDate(startDate.getDate() + index);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const Calendar = ({
  contributions,
  years,
  currentYear,
  taskStats,
  onDateChange,
  fetchContributions,
}) => {
  const handleClick = async (year, index) => {
    const date = getISODateString(currentYear, index);
    onDateChange(year, date);
  };

  const daysInYear = getDaysOfYear(currentYear);
  const weeks = Math.ceil(daysInYear / 7);

  const cellSize = '14px';

  const dayStyle = {
    width: cellSize,
    height: cellSize,
    border: '1px solid #e1e4e8',
    backgroundColor: '#ebedf0',
    justifySelf: 'center',
    alignSelf: 'center',
    cursor: 'pointer',
  };

  const getColor = (successCnt, totalCnt) => {
    if (totalCnt === 0) return '#ebedf0';

    const ratio = successCnt / totalCnt;
    const colorIndex = Math.min(Math.ceil(ratio * 4), 4);
    const colors = ['#ebedf0', '#b8f890', '#a3f66e', '#8df44c', '#78f22b'];

    return colors[colorIndex];
  };

  return (
    <>
      <div className='flex justify-center space-x-2 pt-4 pb-2'>
        {years.map((year) => (
          <button
            key={year}
            className={`text-base p-1 rounded-sm border ${(() => {
              if (
                year == currentYear ||
                (year === '전체' && currentYear == null)
              ) {
                return 'bg-black text-white';
              } else {
                return '';
              }
            })()}`}
            onClick={() => onDateChange(year, null)}
          >
            {year}
          </button>
        ))}
      </div>
      {currentYear !== null && (
        <>
          <div className='flex justify-center p-1'>
            <div className='w-full max-w-lg bg-white'>
              <div className='relative bg-black rounded-full h-4 mb-2'>
                <div
                  className='absolute top-0 left-0 bg-green-500 h-4 rounded-full'
                  style={{
                    width: `${
                      (taskStats.successCnt / taskStats.goalCnt) * 100
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
                    key={index}
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
            {Array.from({ length: daysInYear }).map((_, index) => (
              <Tooltip
                key={index}
                id={`tooltip-${index}`}
                place='top'
                effect='solid'
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Calendar;
