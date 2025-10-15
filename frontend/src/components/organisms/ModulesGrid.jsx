import ModuleCard from '../molecules/ModuleCard';
import Alert from '../atoms/Alert';

export default function ModulesGrid({ modulos, onModuleClick }) {
  if (!modulos || modulos.length === 0) {
    return (
      <Alert 
        type="warning" 
        message="No tienes módulos asignados. Contacta al administrador."
      />
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Módulos Disponibles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modulos.map((modulo) => (
          <ModuleCard
            key={modulo.id}
            modulo={modulo}
            onClick={() => onModuleClick(modulo)}
          />
        ))}
      </div>
    </div>
  );
}