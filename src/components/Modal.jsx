import { createPortal } from "react-dom";
import { memo } from "react";

const Modal = ({ isOpen, onClose, children }) => {


       if (!isOpen) return null;

       return createPortal(
              <div
                     className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeInBg"
                     onClick={onClose}
              >
                     <div
                            className="bg-white rounded-2xl shadow-lg p-6 max-h-[90vh] w-9/10 max-w-lg relative animate-fadeIn"
                            onClick={(e) => e.stopPropagation()}
                     >
                            <button
                                   className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                   onClick={onClose}
                            >
                                   ✕
                            </button>
                            {children}
                     </div>
              </div>
              , document.body
       );
};

export default memo(Modal);
