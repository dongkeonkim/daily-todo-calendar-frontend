import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import CustomAlert from '@/components/Alerts/CustomAlert';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

const initialAlertState = {
  isOpen: false,
  type: 'basic',
  message: '',
  onConfirm: null,
};

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState(initialAlertState);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const showAlert = (message) => {
    setAlertState((prevState) => ({
      ...prevState,
      isOpen: true,
      type: 'basic',
      message,
      onConfirm: null,
    }));
  };

  const showConfirmAlert = (message, onConfirm, onCancel) => {
    setAlertState((prevState) => ({
      ...prevState,
      isOpen: true,
      type: 'confirm',
      message,
      onConfirm: () => {
        onConfirm && onConfirm();
        closeAlert();
      },
      onCancel: () => {
        onCancel ? onCancel() : closeAlert();
      },
    }));
  };

  const closeAlert = () => {
    if (isMounted.current) {
      setAlertState(initialAlertState);
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirmAlert, closeAlert }}>
      {children}
      <CustomAlert {...alertState} onClose={closeAlert} />
    </AlertContext.Provider>
  );
};
