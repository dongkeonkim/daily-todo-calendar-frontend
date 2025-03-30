import { useState, useEffect, useCallback } from 'react';
import api from '@/apis/api';
import { useAlert } from '@/contexts/AlertContext';
import { useLoading } from '@/contexts/LoadingContext';
import { CalendarItem, Memo, TaskStats, Todo } from '@/types';

interface MemoDataResponse {
  code: string;
  message: string;
  result: Memo[];
  timestamp: string;
}

interface CalendarDataResponse {
  code: string;
  message: string;
  result: {
    calendar: CalendarItem[];
    years: string[];
  };
  timestamp: string;
}

/**
 * 메모 데이터를 관리하는 커스텀 훅
 */
export const useMemoData = () => {
  const [notes, setNotes] = useState<Memo[]>([]);
  const [contributions, setContributions] = useState<CalendarItem[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [currentYear, setCurrentYear] = useState<number | null>(
    new Date().getFullYear()
  );
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [taskStats, setTaskStats] = useState<TaskStats>({
    successCnt: 0,
    goalCnt: 0,
  });

  const { showAlert } = useAlert();
  const { startLoading, finishLoading } = useLoading();

  // 메모 조회
  const fetchNotes = useCallback(
    async (year: number | null, date: string | null) => {
      try {
        const params: Record<string, string | number> = {};
        if (year !== null) params.year = year;
        if (date !== null) params.date = date;

        const response = await api.get<MemoDataResponse>('/memo', { params });
        const data = response.data.result.map((note) => ({ ...note }));
        setNotes(data);
        return data;
      } catch (error) {
        console.error('Failed to fetch notes:', error);
        setNotes([]);
        return [];
      }
    },
    []
  );

  // 캘린더 데이터 조회
  const fetchContributions = useCallback(
    async (year: number | null, date: string | null) => {
      try {
        const params: Record<string, string | number> = {};
        if (year !== null) params.year = year;
        if (date !== null) params.date = date;

        const response = await api.get<CalendarDataResponse>('/memo/calendar', {
          params,
        });
        const data = response.data.result;

        // 완료율 계산
        const result = data.calendar.reduce(
          (acc, grass) => {
            acc.successCnt += grass.successCnt;
            acc.goalCnt += grass.totalCnt;
            return acc;
          },
          { successCnt: 0, goalCnt: 0 }
        );

        setContributions(data.calendar);
        setTaskStats(result);
        setYears(data.years);

        return data;
      } catch (error) {
        console.error('Error fetching calendar data:', error);
        return null;
      }
    },
    []
  );

  // 데이터 로드
  const loadData = useCallback(async () => {
    startLoading();
    try {
      await fetchNotes(currentYear, currentDate);
      await fetchContributions(currentYear, currentDate);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      finishLoading();
    }
  }, [
    currentYear,
    currentDate,
    fetchNotes,
    fetchContributions,
    startLoading,
    finishLoading,
  ]);

  // 초기 데이터 로드
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 날짜 변경 핸들러
  const onDateChange = async (
    year: string | number | null,
    date: string | null
  ) => {
    const parsedYear = year !== '전체' && year != null ? Number(year) : null;
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

  // KST ISO 날짜 문자열 반환
  const getKSTISODate = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 메모 생성
  const saveNote = async (
    title: string,
    content: string,
    todos: Todo[],
    scheduleDate: Date | null
  ) => {
    const noteData = {
      title,
      content,
      todos,
      scheduleDate: getKSTISODate(scheduleDate),
    };

    try {
      startLoading();
      const response = await api.post('/memo/create', noteData);
      const data = response.data.result;
      data.scheduleDate = new Date(data.scheduleDate);
      await fetchNotes(currentYear, currentDate);
      return data;
    } catch (error) {
      showAlert('메모 저장에 실패했습니다.');
      throw error;
    } finally {
      finishLoading();
    }
  };

  // 메모 수정
  const updateNote = async (
    id: number,
    title: string,
    content: string,
    todos: Todo[],
    scheduleDate: Date | null
  ) => {
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
      throw error;
    } finally {
      finishLoading();
    }
  };

  // 메모 삭제
  const deleteNote = async (id: number) => {
    try {
      startLoading();
      await api.delete(`/memo/delete/${id}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      await fetchNotes(currentYear, currentDate);
    } catch (error) {
      showAlert('메모 삭제에 실패했습니다.');
      throw error;
    } finally {
      finishLoading();
    }
  };

  return {
    notes,
    contributions,
    years,
    currentYear,
    currentDate,
    taskStats,
    fetchNotes,
    fetchContributions,
    onDateChange,
    saveNote,
    updateNote,
    deleteNote,
  };
};
