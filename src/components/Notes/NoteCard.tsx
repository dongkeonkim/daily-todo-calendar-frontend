import React from 'react';
import { FaTrash, FaCalendarAlt } from 'react-icons/fa';
import { Memo } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

interface NoteCardProps {
  note: Memo;
  onEdit: (index: number) => void;
  onDelete: (id: number) => void;
  index: number;
}

/**
 * 개별 메모 카드 컴포넌트
 */
const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  index,
}) => {
  const { darkMode } = useTheme();
  const handleClick = () => {
    onEdit(index);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (note.id) {
      onDelete(note.id);
    }
  };

  // 날짜 형식화
  const formattedDate = note.scheduleDate
    ? new Date(note.scheduleDate).toLocaleDateString('ko-KR')
    : '';

  // 완료된 할일 개수 계산
  const completedTodos = note.todos.filter((todo) => todo.completed).length;
  const totalTodos = note.todos.length;
  const completionPercentage =
    totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  return (
    <div
      className={`rounded-lg ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } shadow-md border overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg cursor-pointer animate-fade-in`}
      onClick={handleClick}
    >
      <div
        className={`p-5 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <div className='flex justify-between items-start'>
          <h3
            className={`font-semibold text-lg line-clamp-1 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            {note.title}
          </h3>
          <button
            className={`p-1 rounded-full ${
              darkMode
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-500 hover:bg-gray-100'
            } transition-colors`}
            onClick={handleDelete}
            aria-label='메모 삭제'
          >
            <FaTrash size={16} />
          </button>
        </div>
        <p
          className={`text-sm mt-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-500'
          } flex items-center`}
        >
          <FaCalendarAlt className='mr-1' />
          {formattedDate}
        </p>
      </div>

      <div className='p-4'>
        <div
          className={`text-sm mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {totalTodos > 0 ? (
            <>
              {totalTodos}개의 할일 중 {completedTodos}개 완료
            </>
          ) : (
            <>할일이 없습니다</>
          )}
        </div>
        {totalTodos > 0 && (
          <div
            className={`h-1.5 w-full rounded-full ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            } overflow-hidden`}
          >
            <div
              className='h-full bg-primary-500 rounded-full transition-all duration-500'
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
