import React from 'react';

interface KakaoLoginButtonProps {
  onClick: () => void;
}

const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({ onClick }) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className='flex items-center justify-center w-full py-3 px-6 bg-[#FEE500] rounded-lg hover:bg-[#FFEB3B] text-[rgba(0,0,0,0.85)] font-medium text-base transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-lg'
    >
      <span className='mr-2'>
        <svg
          width='22'
          height='22'
          viewBox='0 0 18 18'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M9 0.5C4.02944 0.5 0 3.69365 0 7.68306C0 10.2598 1.7835 12.4951 4.43265 13.7405L3.30532 17.1343C3.22663 17.3937 3.51114 17.6028 3.74305 17.4547L7.81415 14.6973C8.20313 14.7387 8.59799 14.7602 9 14.7602C13.9706 14.7602 18 11.5725 18 7.68306C18 3.69365 13.9706 0.5 9 0.5Z'
            fill='black'
          />
        </svg>
      </span>
      카카오 로그인
    </button>
  );
};

export default KakaoLoginButton;
