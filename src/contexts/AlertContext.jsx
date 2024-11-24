import React, { createContext, useContext, useState } from 'react';
import CustomAlert from '../components/Alerts/CustomAlert';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Alert 열기
  const showAlert = (msg) => {
    setMessage(msg);
    setIsOpen(true);
  };

  // Alert 닫기
  const closeAlert = () => {
    setIsOpen(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <CustomAlert isOpen={isOpen} message={message} onClose={closeAlert} />
    </AlertContext.Provider>
  );
};
