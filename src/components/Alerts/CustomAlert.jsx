import React from 'react';

const CustomAlert = ({ isOpen, type, message, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-82 text-center'>
        <p className='mb-4 text-lg text-gray-800'>{message}</p>
        <div className='flex justify-center gap-4'>
          {type === 'confirm' ? (
            <>
              <button
                className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
                onClick={onConfirm}
              >
                확인
              </button>
              <button
                className='bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400'
                onClick={onClose}
              >
                취소
              </button>
            </>
          ) : (
            <button
              className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
              onClick={onClose}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
