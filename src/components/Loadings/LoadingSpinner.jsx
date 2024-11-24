import React from 'react';
import { useLoading } from '../../contexts/LoadingContext';

const LoadingSpinner = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-50 z-50'>
      <div className='w-24 h-24 border-8 border-green-500 border-t-transparent rounded-full animate-spin mb-6'></div>
    </div>
  );
};

export default LoadingSpinner;
