import React from 'react';

interface CustomAlertProps {
  isOpen: boolean;
  type: 'basic' | 'confirm';
  message: string;
  onConfirm: (() => void) | null;
  onClose: () => void;
  onCancel?: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  isOpen,
  type,
  message,
  onConfirm,
  onClose,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-82 text-center'>
        <p className='mb-4 text-lg text-gray-800'>{message}</p>
        <div className='flex justify-center gap-4'>
          {type === 'confirm' ? (
            <>
              <button
                className='bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors'
                onClick={onConfirm || onClose}
              >
                확인
              </button>
              <button
                className='bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition-colors'
                onClick={onCancel || onClose}
              >
                취소
              </button>
            </>
          ) : (
            <button
              className='bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors'
              onClick={onClose}
            >
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
