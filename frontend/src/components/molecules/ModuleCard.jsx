// src/components/molecules/ModuleCard.jsx
import PropTypes from 'prop-types';
import { Card, Badge } from '../atoms';

export default function ModuleCard({ 
  modulo, 
  onClick 
}) {
  return (
    <Card hoverable onClick={() => onClick(modulo)}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-4xl">{modulo.icono || '📦'}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
            {modulo.nombre}
          </h3>
          <p className="text-sm text-gray-500">{modulo.descripcion}</p>
        </div>
      </div>

      {/* Roles */}
      {modulo.roles && modulo.roles.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-2">Roles:</p>
          <div className="flex flex-wrap gap-2">
            {modulo.roles.map((rol, idx) => (
              <Badge key={idx} variant="primary">
                {rol}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t">
        <p className="text-center text-sm font-medium text-indigo-600">
          Acceder al módulo →
        </p>
      </div>
    </Card>
  );
}

ModuleCard.propTypes = {
  modulo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
    icono: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string),
    url: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};