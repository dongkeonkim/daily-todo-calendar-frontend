import React, { useEffect, useState } from 'react';
import { FaPlus, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { Memo, Todo } from '@/types';
import TodoItem from './TodoItem';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { darkMode } = useTheme();
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

  // 모달 외부 클릭 처리 함수
  const handleOutsideClick = (e: React.MouseEvent) => {
    // 배경 클릭 시에만 모달 닫기
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50'
      onClick={handleOutsideClick}
    >
      <div
        className={`relative rounded-xl shadow-xl overflow-hidden w-full max-w-lg max-h-[90vh] 
        ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } transition-colors`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          } flex justify-between items-center`}
        >
          <h3 className='text-lg font-semibold'>
            {isEdit ? '메모 수정' : '새 메모 추가'}
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${
              darkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-200 text-gray-500 hover:text-gray-800'
            } transition-colors`}
            aria-label='닫기'
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Content */}
        <div
          className='p-5 overflow-y-auto'
          style={{ maxHeight: 'calc(90vh - 130px)' }}
        >
          <div className='space-y-4'>
            <div>
              <input
                type='text'
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder='제목'
                className={`w-full p-2.5 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500'
                    : 'bg-white border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                } border outline-none transition-colors`}
              />
            </div>

            <div>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder='내용을 입력하세요...'
                className={`w-full p-2.5 rounded-lg resize-none h-28 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500'
                    : 'bg-white border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                } border outline-none transition-colors`}
              />
            </div>

            <div>
              <div className='flex mb-2 items-center'>
                <FaCalendarAlt
                  className={`mr-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
                <span
                  className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  날짜 선택
                </span>
              </div>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                dateFormat='yyyy.MM.dd'
                placeholderText='날짜를 선택하세요'
                className={`w-full p-2.5 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300'
                } border outline-none transition-colors`}
                locale={ko}
                onKeyDown={(e) => e.preventDefault()}
              />
            </div>

            <div>
              <div className='flex mb-2 items-center'>
                <span
                  className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  할일 목록
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <input
                  type='text'
                  value={todoContent}
                  onChange={(e) => setTodoContent(e.target.value)}
                  placeholder='새로운 할일'
                  className={`flex-grow p-2.5 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500'
                      : 'bg-white border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                  } border outline-none transition-colors`}
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={addTodo}
                  className={`p-2.5 rounded-lg ${
                    darkMode
                      ? 'bg-primary-600 hover:bg-primary-700'
                      : 'bg-primary-500 hover:bg-primary-600'
                  } text-white transition-colors`}
                  aria-label='할일 추가'
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div
              className={`border rounded-lg p-1 max-h-40 overflow-y-auto ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              } ${currentTodos.length === 0 ? 'hidden' : ''}`}
            >
              <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
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
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          } flex justify-end space-x-2`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? 'bg-gray-600 text-white hover:bg-gray-500'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } transition-colors`}
          >
            취소
          </button>
          <button
            onClick={handleSaveNote}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? 'bg-primary-600 text-white hover:bg-primary-500'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            } transition-colors`}
          >
            {isEdit ? '저장' : '추가'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
