import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import CustomAlert from '@/components/Alerts/CustomAlert';
import { AlertContextType } from '@/types';

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

interface AlertState {
  isOpen: boolean;
  type: 'basic' | 'confirm';
  message: string;
  onConfirm: (() => void) | null;
  onCancel?: () => void;
}

const initialAlertState: AlertState = {
  isOpen: false,
  type: 'basic',
  message: '',
  onConfirm: null,
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertState, setAlertState] = useState<AlertState>(initialAlertState);
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const showAlert = (message: string): void => {
    setAlertState((prevState) => ({
      ...prevState,
      isOpen: true,
      type: 'basic',
      message,
      onConfirm: null,
    }));
  };

  const showConfirmAlert = (
    message: string, 
    onConfirm: () => void, 
    onCancel?: () => void
  ): void => {
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

  const closeAlert = (): void => {
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