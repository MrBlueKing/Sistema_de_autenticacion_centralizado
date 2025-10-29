// components/molecules/ProfileField.jsx
import React from 'react';
import Label from '../atoms/label';
import Input from '../atoms/Input';

const ProfileField = ({ 
  label, 
  name, 
  type = 'text',
  value, 
  onChange, 
  placeholder,
  disabled = false,
  required = false,
  error,
  icon: Icon,
}) => {
  return (
    <div className="w-full">
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <Input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          className={Icon ? 'pl-11' : ''}
        />
      </div>
    </div>
  );
};

export default ProfileField;