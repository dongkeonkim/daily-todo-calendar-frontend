import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import api from '../../apis/api';

// 시작 날짜 + 일 수에 해당하는 날짜를 반환
const getDateString = (index) => {
  const startDate = new Date('2024-01-01'); // TODO: 날짜 변경할 때마다 연도 변경 필요
  const currentDate = new Date(startDate);
  currentDate.setDate(startDate.getDate() + index);
  return currentDate.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });
};

// 시작 날짜 + 일 수에 해당하는 ISO 형식의 날짜를 반환
const getISODateString = (index) => {
  const startDate = new Date('2024-01-01'); // TODO: 날짜 변경할 때마다 연도 변경 필요
  const currentDate = new Date(startDate);
  currentDate.setDate(startDate.getDate() + index);
  return currentDate.toISOString().split('T')[0];
};

const Calendar = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch contributions data from API
    const fetchContributions = async () => {
      try {
        const response = await api.get('/memo/calendar', {
          params: {
            year: 2024,
          },
        });
        console.log(response.data.data);
        setContributions(response.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const cellSize = '14px'; // Set the size of each cell

  const dayStyle = {
    width: cellSize,
    height: cellSize,
    border: '1px solid #e1e4e8',
    backgroundColor: '#ebedf0',
    justifySelf: 'center', // Center horizontally
    alignSelf: 'center', // Center vertically
    cursor: 'pointer', // Add cursor pointer when hovering
  };

  const getColor = (successCnt, totalCnt) => {
    if (totalCnt === 0) return '#ebedf0'; // 전체 횟수가 0일 경우 기본 색상 반환

    const ratio = successCnt / totalCnt; // 성공 비율 계산
    const colorIndex = Math.min(Math.ceil(ratio * 4), 4); // 색상 인덱스 계산 (올림으로 변경)
    const colors = ['#ebedf0', '#b8f890', '#a3f66e', '#8df44c', '#78f22b']; // 색상 배열

    return colors[colorIndex]; // 계산된 인덱스에 해당하는 색상 반환
  };

  const totalTasks = 100;
  const completedTasks = 20;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  if (loading) {
    return <div>Loading...</div>; // 로딩 중일 때 표시할 컴포넌트
  }

  return (
    <>
      <div className='flex justify-center space-x-2 pt-4 pb-2'>
        <button className='text-base p-1 rounded-sm border'>2023</button>
        <button className='text-base p-1 rounded-sm border bg-black text-white'>
          2024
        </button>
        <button className='text-sm p-1 rounded-sm border'>NONE</button>
      </div>

      <div className='flex justify-center p-1'>
        <div className='w-full max-w-lg bg-white'>
          <div className='relative bg-black rounded-full h-4 mb-2'>
            <div
              className='absolute top-0 left-0 bg-green-500 h-4 rounded-full'
              style={{ width: `${progressPercentage}%` }}
            ></div>
            <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
              <span className='text-white font-semibold text-sm'>
                {completedTasks}/{totalTasks}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(73, ${cellSize})`,
          gridAutoRows: cellSize,
          gap: '5px',
          width: '80%',
          margin: '0 auto',
          paddingBottom: '5px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {Array.from({ length: 73 }).map((_, weekIndex) =>
          Array.from({ length: 5 }).map((_, dayIndex) => {
            // 1주차부터 73주차까지, 1일부터 5일까지
            const index = weekIndex * 5 + dayIndex;
            const dateString = getDateString(index);
            const isoDateString = getISODateString(index);

            // 서버에서 제공받은 날짜 데이터 대입
            const contribution = contributions.find(
              (c) => c.scheduleDate === isoDateString
            );

            // 성공한 작업 수와 전체 작업 수
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
              />
            );
          })
        )}
        {Array.from({ length: 73 * 5 }).map((_, index) => (
          <Tooltip
            key={index}
            id={`tooltip-${index}`}
            place='top'
            effect='solid'
          />
        ))}
      </div>
    </>
  );
};

export default Calendar;
