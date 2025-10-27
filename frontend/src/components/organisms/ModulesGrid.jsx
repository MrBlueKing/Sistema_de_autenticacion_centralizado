// src/components/organisms/ModulesGrid.jsx
import PropTypes from 'prop-types';
import { ModuleCard } from '../molecules';

export default function ModulesGrid({ 
  modulos,
  onModuleClick,
  className = ''
}) {
  if (modulos.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">No tienes módulos asignados</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Módulos Disponibles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modulos.map((modulo) => (
          <ModuleCard 
            key={modulo.id}
            modulo={modulo}
            onClick={onModuleClick}
          />
        ))}
      </div>
    </div>
  );
}

ModulesGrid.propTypes = {
  modulos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      descripcion: PropTypes.string,
      icono: PropTypes.string,
      roles: PropTypes.arrayOf(PropTypes.string),
      url: PropTypes.string,
    })
  ).isRequired,
  onModuleClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};