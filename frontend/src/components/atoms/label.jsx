// components/atoms/Label.jsx
import React from 'react';

const Label = ({ 
  htmlFor, 
  children, 
  required = false,
  className = '' 
}) => {
  return (
    <label 
      htmlFor={htmlFor}
      className={`block text-sm font-semibold text-gray-700 mb-2 ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default Label;