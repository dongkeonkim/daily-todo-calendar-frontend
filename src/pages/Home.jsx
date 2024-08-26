import React, { useState, useEffect, useCallback } from 'react';
import Calendar from '../components/Calendar/Calendar';
import Notes from '../components/Notes/Notes';
import api from '../apis/api';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState([]);
  const [currentYear, setCurrentYear] = useState(2024);

  // 숫자 타입을 문자열로 변경
  const [currentDate, setCurrentDate] = useState('');
  const [taskStats, setTaskStats] = useState({ successCnt: 0, goalCnt: 0 });

  // 연도와 날짜를 가지고 메모를 가져오는 함수
  const fetchNotes = useCallback(async (year = null, date = null) => {
    try {
      const params = {};
      if (year) params.year = year;
      if (date) params.date = date;

      const response = await api.get('/memo', { params });
      const data = response.data.data.map((note) => ({
        ...note,
      }));
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      setNotes([]);
    }
  }, []);

  // 연도와 날짜를 가지고 잔디 데이터를 가져오는 함수
  const fetchContributions = async (year = currentYear, date = currentDate) => {
    try {
      const response = await api.get('/memo/calendar', {
        params: { year: year, date: date },
      });

      const grassGraph = response.data.data.calendar;

      const result = grassGraph.reduce(
        (acc, grass) => {
          acc.successCnt += grass.successCnt;
          acc.goalCnt += grass.totalCnt;
          return acc;
        },
        { successCnt: 0, goalCnt: 0 }
      );

      setContributions(grassGraph);
      setTaskStats(result);
      setYears(response.data.data.years);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchContributions();
  }, []);

  const saveNote = async (title, content, todos, scheduleDate) => {
    const noteData = {
      title,
      content,
      todos,
      scheduleDate: getKSTISODate(scheduleDate),
    };

    try {
      let response = await api.post(
        'http://localhost:8080/memo/create',
        noteData
      );
      const data = response.data.data;
      data.scheduleDate = new Date(data.scheduleDate);
      setNotes([...notes, data]);
      fetchNotes();
    } catch (error) {
      alert('메모 저장에 실패했습니다.');
    }
  };

  const updateNote = async (id, title, content, todos, scheduleDate) => {
    const noteData = {
      id,
      title,
      content,
      todos,
      scheduleDate: getKSTISODate(scheduleDate),
    };

    try {
      await api.put('http://localhost:8080/memo/update', noteData);
      fetchNotes(); // 업데이트 후 노트를 다시 가져오기
    } catch (error) {
      console.log(error);
      alert('메모 수정에 실패했습니다.');
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`http://localhost:8080/memo/delete/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
      fetchNotes(); // 삭제 후 노트를 다시 가져오기
    } catch (error) {
      alert('메모 삭제에 실패했습니다.');
    }
  };

  const getKSTISODate = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  // 캘린터에서 데이터 변경시 실행되는 함수
  const onDateChange = (year, date) => {
    setCurrentYear(year !== '미지정' && year != null ? parseInt(year) : null);
    setCurrentDate(date);
    fetchNotes(year !== '미지정' && year != null ? parseInt(year) : null, date);
    fetchContributions(
      year !== '미지정' && year != null ? parseInt(year) : null,
      date
    );
  };

  return (
    <>
      <Calendar
        contributions={contributions}
        years={years}
        currentYear={currentYear}
        taskStats={taskStats}
        loading={loading}
        onDateChange={onDateChange}
        fetchContributions={fetchContributions}
      />
      <div className='flex flex-col items-center min-h-screen mt-5 px-10'>
        <Notes
          notes={notes}
          currentYear={currentYear}
          currentDate={currentDate}
          deleteNote={deleteNote}
          saveNote={saveNote}
          updateNote={updateNote}
          fetchNotes={fetchNotes}
          onDateChange={onDateChange}
        />
      </div>
    </>
  );
};

export default Home;
