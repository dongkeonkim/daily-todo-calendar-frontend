import React, { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import api from '../../apis/api';

// 시작 날짜 + 일 수에 해당하는 날짜를 반환
const getDateString = (index) => {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const currentDate = new Date(startDate);
  currentDate.setDate(startDate.getDate() + index);
  return currentDate.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });
};

// 시작 날짜 + 일 수에 해당하는 ISO 형식의 날짜를 반환
const getISODateString = (index) => {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const currentDate = new Date(startDate);
  currentDate.setDate(startDate.getDate() + index);
  return currentDate.toISOString().split('T')[0];
};

const Calendar = ({ onDateChange }) => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [taskStats, setTaskStats] = useState({ successCnt: 0, goalCnt: 0 });

  // 연도에 해당하는 잔디 데이터를 가져오는 함수. 무조건 연도만 받는다.
  const fetchContributions = async (year = currentYear, date = null) => {
    setCurrentYear(year);

    // 잔디 데이터 api
    if (year === '미지정') year = '';

    try {
      const response = await api.get('/memo/calendar', {
        params: {
          year: year,
          date: date,
        },
      });

      const grassGraph = response.data.data.calendar;

      const result = grassGraph.reduce(
        (acc, grass) => {
          acc.successCnt += grass.successCnt;
          acc.goalCnt += grass.totalCnt;
          return acc;
        },
        { successCnt: 0, goalCnt: 0 }
      );

      // 잔디에 넣어줄 데이터 목록
      setContributions(grassGraph);

      // 작업 통계 데이터
      setTaskStats(result);

      // 연도 버튼 목록
      setYears(response.data.data.years);

      // 캘린더의 버튼을 통해 선택된 연도를 상위 컴포넌트로 전달
      onDateChange(year, null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchContributions(); // 초기 로딩 시 현재 연도로 데이터 가져오기
  }, []);

  useEffect(() => {
    console.log(currentYear);
  }, [currentYear]);

  // 잔디 캘린더에서 날짜 클릭시
  const handleClick = async (year, index) => {
    const date = getISODateString(index);
    await fetchContributions(year, date);
    onDateChange(year, date); // 상위 컴포넌트로 선택된 날짜 전달
  };

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
        {years.map((year) => (
          <button
            key={year}
            className={`text-base p-1 rounded-sm border ${
              year == currentYear ? 'bg-black text-white' : ''
            }`}
            onClick={() => fetchContributions(year, null)}
          >
            {year}
          </button>
        ))}
      </div>

      <div className='flex justify-center p-1'>
        <div className='w-full max-w-lg bg-white'>
          <div className='relative bg-black rounded-full h-4 mb-2'>
            <div
              className='absolute top-0 left-0 bg-green-500 h-4 rounded-full'
              style={{
                width: `${(taskStats.successCnt / taskStats.goalCnt) * 100}%`,
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
                onClick={() => handleClick(currentYear, index)}
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
