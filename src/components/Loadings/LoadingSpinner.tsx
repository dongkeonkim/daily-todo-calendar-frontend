import React from 'react';
import { useLoading } from '@/contexts/LoadingContext';

/**
 * 로딩 상태를 시각적으로 표시하는 스피너 컴포넌트
 * LoadingContext를 통해 로딩 상태를 구독
 */
const LoadingSpinner: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-50 z-50'>
      <div className='w-24 h-24 border-8 border-green-500 border-t-transparent rounded-full animate-spin mb-6'></div>
    </div>
  );
};

export default LoadingSpinner;
