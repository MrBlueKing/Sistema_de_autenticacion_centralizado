import { createContext, useState, useCallback } from 'react';
import ToastContainer from '../components/organisms/ToastContainer';

export const ToastContext = createContext(null);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((type, message, description, duration = 5000) => {
    const id = ++toastIdCounter;
    const newToast = {
      id,
      type,
      message,
      description,
      duration
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    return id;
  }, []);

  const success = useCallback((message, description) => {
    return addToast('success', message, description, 5000);
  }, [addToast]);

  const error = useCallback((message, description) => {
    return addToast('error', message, description, 7000);
  }, [addToast]);

  const warning = useCallback((message, description) => {
    return addToast('warning', message, description, 6000);
  }, [addToast]);

  const info = useCallback((message, description) => {
    return addToast('info', message, description, 5000);
  }, [addToast]);

  const value = {
    success,
    error,
    warning,
    info,
    removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}
