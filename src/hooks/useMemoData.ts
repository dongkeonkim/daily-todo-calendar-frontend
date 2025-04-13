import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [currentMonth, setCurrentMonth] = useState<number | null>(
    new Date().getMonth() + 1 // 1-12 표시, 기본값은 현재 월
  );
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [taskStats, setTaskStats] = useState<TaskStats>({
    successCnt: 0,
    goalCnt: 0,
  });
  const isFirstRender = useRef(true);

  const { showAlert } = useAlert();
  const { startLoading, finishLoading } = useLoading();

  // 메모 조회
  const fetchNotes = useCallback(
    async (year: number | null, month: number | null, date: string | null) => {
      try {
        const params: Record<string, string | number> = {};
        if (year !== null) params.year = year;
        if (month !== null) params.month = month;
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
    [setNotes]
  );

  // 캘린더 데이터 조회
  const fetchContributions = useCallback(
    async (year: number | null, month: number | null) => {
      try {
        const params: Record<string, string | number> = {};
        if (year !== null) params.year = year;
        if (month !== null) params.month = month;

        const response = await api.get<CalendarDataResponse>('/memo/calendar', {
          params,
        });
        const data = response.data.result;

        // 완료율 계산
        const result = data.calendar.reduce(
          (acc, grass) => {
            acc.successCnt += grass.completedCount;
            acc.goalCnt += grass.totalCount;
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
    [setContributions, setTaskStats, setYears]
  );

  // 초기 데이터 로드 (첫 렌더링에서만 실행)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      const initialLoad = async () => {
        startLoading();
        try {
          await fetchNotes(currentYear, currentMonth, null);
          await fetchContributions(currentYear, currentMonth);
        } catch (error) {
          console.error('Error loading initial data:', error);
        } finally {
          finishLoading();
        }
      };

      initialLoad();
    }
  }, [fetchNotes, fetchContributions]);

  // 날짜 변경 핸들러
  const onDateChange = async (
    year: string | number | null,
    month: number | null,
    date: string | null
  ) => {
    const parsedYear = year !== '전체' && year != null ? Number(year) : null;
    setCurrentYear(parsedYear);
    setCurrentMonth(month);
    setCurrentDate(date);

    startLoading();
    try {
      await fetchNotes(parsedYear, month, date);
      await fetchContributions(parsedYear, month);
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
      await fetchNotes(currentYear, currentMonth, currentDate);
      await fetchContributions(currentYear, currentMonth);
      return data;
    } catch (error) {
      showAlert('메모 저장에 실패했습니다.');
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
      await fetchNotes(currentYear, currentMonth, currentDate);
      await fetchContributions(currentYear, currentMonth);
    } catch (error) {
      showAlert('메모 수정에 실패했습니다.');
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
      await fetchNotes(currentYear, currentMonth, currentDate);
      await fetchContributions(currentYear, currentMonth);
    } catch (error) {
      showAlert('메모 삭제에 실패했습니다.');
    } finally {
      finishLoading();
    }
  };

  return {
    notes,
    contributions,
    years,
    currentYear,
    currentMonth,
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
