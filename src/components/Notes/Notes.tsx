import React, { useState } from 'react';
import { Memo, Todo } from '@/types';
import NoteCard from './NoteCard';
import NoteModal from './NoteModal';
import { FaPlus } from 'react-icons/fa';
import { useTheme } from '@/contexts/ThemeContext';

interface NotesProps {
  notes: Memo[];
  currentYear: number | null;
  currentDate: string | null;
  deleteNote: (id: number) => Promise<void>;
  saveNote: (
    title: string,
    content: string,
    todos: Todo[],
    scheduleDate: Date | null
  ) => Promise<void>;
  updateNote: (
    id: number,
    title: string,
    content: string,
    todos: Todo[],
    scheduleDate: Date | null
  ) => Promise<void>;
}

/**
 * 메모 목록 컴포넌트
 */
const Notes: React.FC<NotesProps> = ({
  notes,
  deleteNote,
  saveNote,
  updateNote,
}) => {
  const { darkMode } = useTheme();
  
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentNote, setCurrentNote] = useState<Partial<Memo>>({
    title: '',
    content: '',
    todos: [],
    scheduleDate: null,
  });

  // 새 메모 모달 열기
  const openModal = () => {
    setCurrentNote({
      title: '',
      content: '',
      todos: [],
      scheduleDate: null,
    });
    setIsModalOpen(true);
    setIsEdit(false);
  };

  // 메모 편집 모달 열기
  const openEditModal = (index: number) => {
    setIsModalOpen(true);
    setIsEdit(true);
    setEditIndex(index);
    setCurrentNote(notes[index]);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setEditIndex(null);
  };

  // 메모 저장
  const handleSaveNote = async (
    id: number | undefined,
    title: string,
    content: string,
    todos: Todo[],
    selectedDate: Date | null
  ) => {
    if (isEdit && id !== undefined) {
      await updateNote(id, title, content, todos, selectedDate);
    } else {
      await saveNote(title, content, todos, selectedDate);
    }
    closeModal();
  };

  return (
    <>
      <div className="flex justify-center mb-8 w-full max-w-3xl mx-auto">
        <button
          onClick={openModal}
          className={`py-3 px-6 rounded-lg shadow-md ${
            darkMode
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-primary-500 text-white hover:bg-primary-600'
          } transition-colors transform hover:scale-105 flex items-center gap-2 font-medium`}
        >
          <FaPlus />
          새로운 메모 추가
        </button>
      </div>

      {notes.length === 0 ? (
        <div className={`text-center py-12 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-500'} shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-lg">등록된 메모가 없습니다.</p>
          <p className="mt-2">새로운 메모를 추가해보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {notes.map((note, noteIndex) => (
            <NoteCard
              key={note.id || noteIndex}
              note={note}
              index={noteIndex}
              onEdit={openEditModal}
              onDelete={deleteNote}
            />
          ))}
        </div>
      )}

      <NoteModal
        isOpen={isModalOpen}
        isEdit={isEdit}
        note={currentNote}
        onClose={closeModal}
        onSave={handleSaveNote}
      />
    </>
  );
};

export default Notes;