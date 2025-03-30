import React from 'react';
import Calendar from '@/components/Calendar/Calendar';
import Notes from '@/components/Notes/Notes';
import { useMemoData } from '@/hooks/useMemoData';

/**
 * 메인 홈 페이지 컴포넌트
 * 캘린더와 메모 목록을 표시
 */
const Home: React.FC = () => {
  // 커스텀 훅을 통해 메모 데이터 관리
  const {
    notes,
    contributions,
    years,
    currentYear,
    currentDate,
    taskStats,
    onDateChange,
    saveNote,
    updateNote,
    deleteNote,
  } = useMemoData();

  return (
    <div className='min-h-screen'>
      <Calendar
        contributions={contributions}
        years={years}
        currentYear={currentYear}
        taskStats={taskStats}
        onDateChange={onDateChange}
      />
      <div className='flex flex-col items-center min-h-screen mt-5 px-4 sm:px-10'>
        <Notes
          notes={notes}
          currentYear={currentYear}
          currentDate={currentDate}
          deleteNote={deleteNote}
          saveNote={saveNote}
          updateNote={updateNote}
        />
      </div>
    </div>
  );
};

export default Home;
