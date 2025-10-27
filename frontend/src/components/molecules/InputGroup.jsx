// src/components/molecules/InputGroup.jsx
import PropTypes from 'prop-types';
import Input  from '../atoms/Input';

export default function InputGroup({ 
  label,
  icon: Icon,
  type = 'text',
  value = '',
  onChange,
  placeholder,
  required = false,
  autoComplete,
  className = ''
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        
        <Input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={Icon ? 'pl-10' : ''}
        />
      </div>
    </div>
  );
}

InputGroup.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.elementType,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  autoComplete: PropTypes.string,
  className: PropTypes.string,
};