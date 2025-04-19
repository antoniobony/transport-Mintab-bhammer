import { NotfiContext } from '@/app/(context)/notif';
import { useContext, useEffect, useState } from 'react';

export const ToastNotification = ({ title, message }:{title:string,message:string}) => {
  const [isVisible, setIsVisible] = useState(false);
  const {dispatchNotif} = useContext(NotfiContext)
  
  useEffect(() => {
    if (title && message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        dispatchNotif({
          payload:{
            title:"",
            message:""
          }
        })
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [title, message]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!title || !message) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50">
      <div
        className={`min-w-[250px] relative bg-white border border-gray-200 rounded-lg shadow-lg transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center justify-between p-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
          <strong className="text-sm font-semibold">{title}</strong>
          <button
            type="button"
            className="text-white bg-red-500 hover:bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs"
            onClick={handleClose}
          >
            X
          </button>
        </div>
        <div className="p-4 text-sm">{message}</div>
        
      </div>
    </div>
  );
};
