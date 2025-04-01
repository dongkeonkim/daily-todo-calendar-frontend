// 사용자 관련 타입
export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  delYn: boolean;
  regDate: string;
  udtDate: string;
}

// 할일 관련 타입
export interface Todo {
  id?: number;
  memberId?: number;
  content: string;
  completed: boolean;
  memoId?: number;
  todoRegDate?: string;
  todoUdtDate?: string;
}

// 메모 관련 타입
export interface Memo {
  id?: number;
  memberId?: number;
  title: string;
  content?: string;
  todos: Todo[];
  scheduleDate?: string | Date | null;
  regDate?: string;
  udtDate?: string;
}

// 캘린더 관련 타입
export interface CalendarItem {
  scheduleDate: string;
  successCnt: number;
  totalCnt: number;
}

export interface TaskStats {
  successCnt: number;
  goalCnt: number;
}

// 로그인 및 인증 관련 타입
export interface LoginForm {
  email: string;
  password: string;
}

export interface JoinForm {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
}

// 에러 관련 타입
export interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  [key: string]: string | undefined;
}

// 컨텍스트 타입
export interface LoginContextType {
  isLogin: boolean;
  userInfo: User | null;
  login: (email: string, password: string) => Promise<void>;
  kakaoLogin: (code: string) => Promise<void>;
  logout: () => void;
}

export interface AlertContextType {
  showAlert: (message: string) => void;
  showConfirmAlert: (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => void;
  closeAlert: () => void;
}

export interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  finishLoading: () => void;
}
