import React from 'react';
import Calendar from '@/components/Calendar/Calendar';
import Notes from '@/components/Notes/Notes';
import { useMemoData } from '@/hooks/useMemoData';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * 메인 홈 페이지 컴포넌트
 * 캘린더와 메모 목록을 표시
 */
const Home: React.FC = () => {
  const { darkMode } = useTheme();

  const {
    notes,
    contributions,
    years,
    currentYear,
    currentMonth,
    currentDate,
    taskStats,
    onDateChange,
    saveNote,
    updateNote,
    deleteNote,
  } = useMemoData();

  return (
    <div
      className={`min-h-screen px-4 py-6 ${
        darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'
      }`}
    >
      <div className='container mx-auto'>
        <Calendar
          contributions={contributions}
          years={years}
          currentYear={currentYear}
          currentMonth={currentMonth}
          currentDate={currentDate}
          taskStats={taskStats}
          onDateChange={onDateChange}
        />

        <div className='max-w-5xl mx-auto mt-8'>
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
    </div>
  );
};

export default Home;
