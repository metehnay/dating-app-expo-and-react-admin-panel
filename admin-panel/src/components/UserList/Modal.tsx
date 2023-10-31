// components/Modal.tsx

import React from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-70 flex justify-center items-center">
      <div className="w-1/2 bg-gray-900 p-8 rounded-lg shadow-md text-gray-200">
        {children}
        <button
          onClick={onClose}
          className="mt-5 float-right bg-red-500 text-gray-900 px-4 py-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          ✖️ Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
