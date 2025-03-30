import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { Memo, Todo } from '@/types';
import TodoItem from './TodoItem';

interface NoteModalProps {
  isOpen: boolean;
  isEdit: boolean;
  note: Partial<Memo>;
  onClose: () => void;
  onSave: (
    id: number | undefined,
    title: string,
    content: string,
    todos: Todo[],
    date: Date | null
  ) => void;
}

/**
 * 메모 및 할일 편집/생성을 위한 모달 컴포넌트
 */
const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  isEdit,
  note,
  onClose,
  onSave,
}) => {
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteContent, setNoteContent] = useState<string>('');
  const [todoContent, setTodoContent] = useState<string>('');
  const [currentTodos, setCurrentTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 모달이 열릴 때 데이터 초기화
  useEffect(() => {
    if (isOpen) {
      setNoteTitle(note.title || '');
      setNoteContent(note.content || '');
      setCurrentTodos(note.todos || []);
      setSelectedDate(note.scheduleDate ? new Date(note.scheduleDate) : null);
    }
  }, [isOpen, note]);

  // ESC 키 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // 할일 추가
  const addTodo = () => {
    if (todoContent.trim() !== '') {
      setCurrentTodos([
        ...currentTodos,
        { content: todoContent, completed: false },
      ]);
      setTodoContent('');
    }
  };

  // 엔터키 할일 추가
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTodo();
    }
  };

  // 할일 삭제
  const deleteCurrentTodo = (index: number) => {
    setCurrentTodos(currentTodos.filter((_, i) => i !== index));
  };

  // 할일 완료 상태 토글
  const toggleTodoCompletion = (index: number) => {
    setCurrentTodos(
      currentTodos.map((todo, i) => {
        if (i === index) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      })
    );
  };

  // 메모 저장
  const handleSaveNote = () => {
    onSave(note.id, noteTitle, noteContent, currentTodos, selectedDate);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md max-h-[80vh]'>
        <div className='p-6 overflow-y-auto' style={{ maxHeight: '70vh' }}>
          <div className='space-y-4'>
            <input
              type='text'
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder='제목'
              className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
            />
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder='내용'
              className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none h-24'
            />
            <div className='flex items-center space-x-2'>
              <input
                type='text'
                value={todoContent}
                onChange={(e) => setTodoContent(e.target.value)}
                placeholder='할 일'
                className='flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={addTodo}
                className='p-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors'
                aria-label='할일 추가'
              >
                <FaPlus />
              </button>
            </div>
            <ul className='space-y-1 max-h-40 overflow-y-auto'>
              {currentTodos.map((todo, index) => (
                <TodoItem
                  key={index}
                  todo={todo}
                  index={index}
                  onToggle={toggleTodoCompletion}
                  onDelete={deleteCurrentTodo}
                />
              ))}
            </ul>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                setSelectedDate(date);
              }}
              dateFormat='yyyy.MM.dd'
              placeholderText='날짜 지정'
              className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              onKeyDown={(e) => e.preventDefault()}
              locale={ko}
            />
          </div>
          <div className='mt-4'>
            <div className='my-1 w-full'>
              <button
                onClick={handleSaveNote}
                className='px-4 py-2 w-full bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors'
              >
                {isEdit ? '수정' : '추가'}
              </button>
            </div>
          </div>
          <div className='my-1 w-full'>
            <button
              onClick={onClose}
              className='px-4 py-2 w-full bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors'
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
