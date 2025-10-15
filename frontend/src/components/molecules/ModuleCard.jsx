import { HiArrowTopRightOnSquare, HiShieldCheck, HiKey } from 'react-icons/hi2';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';

export default function ModuleCard({ modulo, onClick }) {
  return (
    <Card className="p-6 hover:shadow-md transition-all cursor-pointer hover:border-indigo-300 group">
      <div onClick={onClick}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{modulo.icono || '📦'}</div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {modulo.nombre}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {modulo.descripcion}
              </p>
            </div>
          </div>
          <HiArrowTopRightOnSquare className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
        </div>

        {/* Roles */}
        {modulo.roles && modulo.roles.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <HiShieldCheck className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-600">Roles:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {modulo.roles.map((rol, index) => (
                <Badge key={index} variant="primary">
                  {rol}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Permisos */}
        {modulo.permisos && modulo.permisos.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <HiKey className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-600">
                Permisos: {modulo.permisos.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {modulo.permisos.slice(0, 3).map((permiso, index) => (
                <Badge key={index}>
                  {permiso}
                </Badge>
              ))}
              {modulo.permisos.length > 3 && (
                <Badge>
                  +{modulo.permisos.length - 3} más
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-center text-sm font-medium text-indigo-600 group-hover:text-indigo-700 transition-colors">
            Acceder al módulo →
          </p>
        </div>
      </div>
    </Card>
  );
}