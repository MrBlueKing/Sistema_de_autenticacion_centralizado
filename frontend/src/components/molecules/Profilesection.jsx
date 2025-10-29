// components/molecules/ProfileSection.jsx
import React from 'react';

const ProfileSection = ({ 
  title, 
  description, 
  icon: Icon, 
  children,
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden ${className}`}>
      {/* Header de la sección */}
      <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contenido de la sección */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default ProfileSection;