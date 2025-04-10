import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 404 Not Found 페이지 컴포넌트
 */
const NotFound: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center h-[calc(100vh-64px)] px-4'>
      <h1 className='text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4'>
        404
      </h1>
      <p className='text-xl text-gray-600 dark:text-gray-400 mb-8'>
        페이지를 찾을 수 없습니다
      </p>
      <p className='text-md text-gray-500 dark:text-gray-500 mb-8 text-center'>
        요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
      </p>
      <Link
        to='/'
        className='px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300'
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;
