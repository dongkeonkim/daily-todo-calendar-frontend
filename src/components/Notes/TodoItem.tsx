import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { Todo } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

interface TodoItemProps {
  todo: Todo;
  onToggle: (index: number) => void;
  onDelete: (index: number) => void;
  index: number;
}

/**
 * 개별 할일 항목 컴포넌트
 */
const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  index,
}) => {
  const { darkMode } = useTheme();
  
  return (
    <li className={`flex items-center py-2 px-1 rounded-md ${darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100'} transition-colors`}>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(index)}
          className="sr-only"
          id={`todo-${index}`}
        />
        <label
          htmlFor={`todo-${index}`}
          className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border ${
            todo.done 
              ? 'bg-primary-500 border-primary-500' 
              : `border-gray-300 ${darkMode ? 'dark:border-gray-600' : ''}`
          } transition-colors`}
        >
          {todo.done && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </label>
      </div>
      
      <span
        className={`ml-3 flex-grow ${
          todo.done 
            ? `line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}` 
            : `${darkMode ? 'text-gray-200' : 'text-gray-800'}`
        } transition-colors`}
      >
        {todo.text}
      </span>
      
      <button
        className={`p-1 rounded-full ${
          darkMode 
            ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
            : 'text-gray-500 hover:text-red-500 hover:bg-gray-200'
        } transition-colors`}
        onClick={() => onDelete(index)}
        aria-label="할일 삭제"
      >
        <FaTrash size={14} />
      </button>
    </li>
  );
};

export default TodoItem;