import React, { useState, useEffect, useCallback } from 'react';
import Calendar from '../components/Calendar/Calendar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaTrash, FaPlus } from 'react-icons/fa';
import api from '../apis/api';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [noteId, setNoteId] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [todoContent, setTodoContent] = useState('');
  const [currentTodos, setCurrentTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const fetchNotes = useCallback(async (year = null, date = null) => {
    try {
      const params = {};
      if (year) params.year = year;
      if (date) params.date = date;

      const response = await api.get('http://localhost:8080/memo', { params });
      const data = response.data.data.map((note) => ({
        ...note,
      }));
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
    setIsEdit(false);
  };

  const openEditModal = (index) => {
    setIsModalOpen(true);
    setIsEdit(true);
    setEditIndex(index);
    const note = notes[index];
    setNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setCurrentTodos(note.todos);
    setSelectedDate(note.scheduleDate);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNoteId('');
    setNoteTitle('');
    setNoteContent('');
    setTodoContent('');
    setCurrentTodos([]);
    setSelectedDate(null);
    setIsEdit(false);
    setEditIndex(null);
  };

  const addTodo = () => {
    if (todoContent.trim() !== '') {
      setCurrentTodos([
        ...currentTodos,
        { content: todoContent, completed: false },
      ]);
      setTodoContent('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  };

  const deleteCurrentTodo = (index) => {
    setCurrentTodos(currentTodos.filter((_, i) => i !== index));
  };

  const toggleTodoCompletion = (index) => {
    setCurrentTodos(
      currentTodos.map((todo, i) => {
        if (i === index) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      })
    );
  };

  const updateNote = async () => {
    const noteData = {
      id: noteId,
      title: noteTitle,
      content: noteContent,
      todos: currentTodos,
      scheduleDate: getKSTISODate(selectedDate),
    };

    try {
      await api.put('http://localhost:8080/memo/update', noteData);
    } catch (error) {
      console.log(error);
      alert('메모 수정에 실패했습니다.');
    }
  };

  const saveNote = async () => {
    if (
      noteTitle.trim() !== '' &&
      (noteContent.trim() !== '' || currentTodos.length > 0)
    ) {
      const noteData = {
        title: noteTitle,
        content: noteContent,
        todos: currentTodos,
        scheduleDate: getKSTISODate(selectedDate),
      };

      console.log(noteData);

      try {
        let response = await api.post(
          'http://localhost:8080/memo/create',
          noteData
        );

        const data = response.data.data;
        data.scheduleDate = new Date(data.scheduleDate);

        if (isEdit && editIndex !== null) {
          const updatedNotes = notes.map((note, index) => {
            if (index === editIndex) {
              return noteData;
            }
            return note;
          });
          setNotes(updatedNotes);
        } else {
          setNotes([...notes, data]);
        }

        closeModal();
      } catch (error) {
        alert('메모 저장에 실패했습니다.');
      }
    }
  };

  const getKSTISODate = (date) => {
    if (!date) return '';
    const offset = date.getTimezoneOffset() * 60000; // 현재 타임존 오프셋 (밀리초)
    const kstDate = new Date(date.getTime() - offset + 9 * 3600000); // 한국 표준시로 변환
    return kstDate.toISOString().split('T')[0];
  };

  const deleteNote = async (id) => {
    console.log(id);
    try {
      await api.delete(`http://localhost:8080/memo/delete/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      alert('메모 삭제에 실패했습니다.');
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchNotes(null, date);
  };

  return (
    <>
      <Calendar onDateChange={handleDateChange} />
      {/* 포스트잇 기능 */}
      <div className='flex flex-col items-center min-h-screen mt-5'>
        <div className='w-full rounded-lg text-lg items-center'>
          <div className='flex w-full justify-center'>
            <button
              onClick={openModal}
              className='w-1/5 py-2 text-black border shadow rounded-md hover:bg-gray-200 transition duration-200'
            >
              새로운 메모
            </button>
          </div>
          <div className='mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 w-full'>
            {notes.map((note, noteIndex) => (
              <div
                key={noteIndex}
                className='relative p-4 m-1 border shadow rounded-md cursor-pointer'
                onClick={() => openEditModal(noteIndex)}
              >
                <h2 className='text-xl font-semibold truncate'>{note.title}</h2>
                <p className='mt-2'>
                  {note.scheduleDate
                    ? new Date(note.scheduleDate).toLocaleDateString('Ko-Kr')
                    : ''}
                </p>
                <button
                  className='absolute top-2 right-2 flex items-center justify-center w-6 h-6 text-white bg-gray-500 rounded-full hover:bg-red-600'
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {isModalOpen && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
            <div className='bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md max-h-[80vh]'>
              <div
                className='p-6 overflow-y-auto'
                style={{ maxHeight: '70vh' }}
              >
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
                      className='p-2 bg-black text-white rounded-md transition duration-200'
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <ul className='space-y-1'>
                    {currentTodos.map((todo, index) => (
                      <li key={index} className='flex items-center'>
                        <input
                          type='checkbox'
                          checked={todo.completed}
                          onChange={() => toggleTodoCompletion(index)}
                          className='mr-2 h-6 w-6 flex-shrink-0'
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
                          className='text-gray-400 transition duration-200'
                          onClick={() => deleteCurrentTodo(index)}
                        >
                          <FaTrash />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat='yyyy.MM.dd'
                    placeholderText='날짜 지정'
                    className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                  />
                </div>
                <div className='mt-4'>
                  <div className='my-1 w-full'>
                    {!isEdit ? (
                      <button
                        onClick={saveNote}
                        className='px-4 py-2 w-full bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200'
                      >
                        추가
                      </button>
                    ) : (
                      <button
                        onClick={updateNote}
                        className='px-4 py-2 w-full bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200'
                      >
                        수정
                      </button>
                    )}
                  </div>
                </div>
                <div className='my-1 w-full'>
                  <button
                    onClick={closeModal}
                    className='px-4 py-2 w-full bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200'
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
