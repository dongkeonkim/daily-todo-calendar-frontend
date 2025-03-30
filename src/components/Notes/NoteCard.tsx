import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { Memo } from '@/types';

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

  return (
    <div
      className='relative p-4 m-1 border shadow rounded-md cursor-pointer hover:shadow-md transition-shadow'
      onClick={handleClick}
    >
      <h2 className='text-xl font-semibold truncate'>{note.title}</h2>
      <p className='mt-2 text-gray-600'>{formattedDate}</p>
      <button
        className='absolute top-2 right-2 flex items-center justify-center w-6 h-6 text-white bg-gray-500 rounded-full hover:bg-red-600 transition-colors'
        onClick={handleDelete}
        aria-label='메모 삭제'
      >
        <FaTrash size={12} />
      </button>
    </div>
  );
};

export default NoteCard;
