import React, { useState, useEffect, useCallback } from 'react';
import Calendar from '../components/Calendar/Calendar';
import Notes from '../components/Notes/Notes';
import api from '../apis/api';
import { useAlert } from '../contexts/AlertContext';
import { useLoading } from '../contexts/LoadingContext';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [years, setYears] = useState([]);
  const [currentYear, setCurrentYear] = useState(2024);
  const [currentDate, setCurrentDate] = useState(null);
  const [taskStats, setTaskStats] = useState({ successCnt: 0, goalCnt: 0 });
  const { showAlert } = useAlert();
  const { startLoading, finishLoading } = useLoading();

  // 연도와 날짜를 가지고 메모를 가져오는 함수
  const fetchNotes = useCallback(async (year, date) => {
    try {
      const response = await api.get('/memo', { params: { year, date } });
      const data = response.data.data.map((note) => ({ ...note }));
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      setNotes([]);
    }
  }, []);

  // 연도와 날짜를 가지고 잔디 데이터를 가져오는 함수
  const fetchContributions = useCallback(async (year, date) => {
    try {
      const response = await api.get('/memo/calendar', {
        params: { year, date },
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
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      startLoading();
      try {
        await fetchNotes(currentYear, currentDate);
        await fetchContributions(currentYear, currentDate);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        finishLoading();
      }
    };

    loadData();
  }, [currentYear, currentDate, fetchNotes, fetchContributions]); // 의존성 정리

  const saveNote = async (title, content, todos, scheduleDate) => {
    const noteData = {
      title,
      content,
      todos,
      scheduleDate: getKSTISODate(scheduleDate),
    };

    try {
      startLoading();
      const response = await api.post('/memo/create', noteData);
      const data = response.data.data;
      data.scheduleDate = new Date(data.scheduleDate);
      setNotes((prevNotes) => [...prevNotes, data]);
      await fetchNotes(currentYear, currentDate);
    } catch (error) {
      showAlert('메모 저장에 실패했습니다.');
    } finally {
      finishLoading();
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
      startLoading();
      await api.put('/memo/update', noteData);
      await fetchNotes(currentYear, currentDate);
    } catch (error) {
      showAlert('메모 수정에 실패했습니다.');
    } finally {
      finishLoading();
    }
  };

  const deleteNote = async (id) => {
    try {
      startLoading();
      await api.delete(`/memo/delete/${id}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      await fetchNotes(currentYear, currentDate);
    } catch (error) {
      showAlert('메모 삭제에 실패했습니다.');
    } finally {
      finishLoading();
    }
  };

  const getKSTISODate = (date) => {
    if (!date) return '';
    date = new Date(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // 캘린더에서 데이터 변경 시 실행되는 함수
  const onDateChange = async (year, date) => {
    const parsedYear = year !== '전체' && year != null ? parseInt(year) : null;
    setCurrentYear(parsedYear);
    setCurrentDate(date);
    startLoading();
    try {
      await fetchNotes(parsedYear, date);
      await fetchContributions(parsedYear, date);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      finishLoading();
    }
  };

  return (
    <>
      <Calendar
        contributions={contributions}
        years={years}
        currentYear={currentYear}
        taskStats={taskStats}
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
