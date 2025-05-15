import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === 'success'
      ? 'bg-green-500'
      : type === 'error'
      ? 'bg-red-500'
      : 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 z-50`}>
      <div
        className={`text-white px-4 py-3 rounded shadow-lg ${bgColor} transition-opacity duration-300`}
      >
        {message}
      </div>
    </div>
  );
};

export default Toast;
