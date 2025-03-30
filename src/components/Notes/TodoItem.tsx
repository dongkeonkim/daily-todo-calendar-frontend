import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { Todo } from '@/types';

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
  return (
    <li className='flex items-center py-1'>
      <input
        type='checkbox'
        checked={todo.completed}
        onChange={() => onToggle(index)}
        className='mr-2 h-6 w-6 flex-shrink-0 cursor-pointer'
        style={{ minWidth: '24px', minHeight: '24px' }}
      />
      <span
        className={`flex-grow ${
          todo.completed ? 'line-through text-gray-500' : ''
        }`}
      >
        {todo.content}
      </span>
      <button
        className='text-gray-400 hover:text-red-500 transition-colors'
        onClick={() => onDelete(index)}
        aria-label='할일 삭제'
      >
        <FaTrash />
      </button>
    </li>
  );
};

export default TodoItem;
