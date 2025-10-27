// src/components/templates/AuthTemplate.jsx
import PropTypes from 'prop-types';

export default function AuthTemplate({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {children}
    </div>
  );
}

AuthTemplate.propTypes = {
  children: PropTypes.node.isRequired,
};