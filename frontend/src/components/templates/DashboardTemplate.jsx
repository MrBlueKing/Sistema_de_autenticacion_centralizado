// src/components/templates/DashboardTemplate.jsx
import PropTypes from 'prop-types';
import { Header } from '../organisms';

export default function DashboardTemplate({ 
  user,
  onLogout,
  children 
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header user={user} onLogout={onLogout} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

DashboardTemplate.propTypes = {
  user: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    apellido: PropTypes.string.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};