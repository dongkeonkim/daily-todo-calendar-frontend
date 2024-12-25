import React from 'react';

const CustomAlert = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-82 text-center'>
        <p className='mb-4 text-lg text-gray-800'>{message}</p>
        <button
          className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;
