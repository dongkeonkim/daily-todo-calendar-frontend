import React, { useState } from 'react';
import { Memo, Todo } from '@/types';
import NoteCard from './NoteCard';
import NoteModal from './NoteModal';

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
      <div className='flex w-full justify-center mb-6'>
        <button
          onClick={openModal}
          className='w-full md:w-1/3 py-3 text-black border shadow rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center'
        >
          새로운 메모
        </button>
      </div>

      {notes.length === 0 ? (
        <div className='text-center text-gray-500 py-10'>
          등록된 메모가 없습니다. 새로운 메모를 추가해보세요!
        </div>
      ) : (
        <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full'>
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
