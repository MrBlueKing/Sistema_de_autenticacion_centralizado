// src/components/molecules/UserInfoItem.jsx
import PropTypes from 'prop-types';

export default function UserInfoItem({ 
  label, 
  value, 
  className = '' 
}) {
  return (
    <div className={className}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value || 'No asignado'}</p>
    </div>
  );
}

UserInfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  className: PropTypes.string,
};