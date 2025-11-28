-- Script para actualizar colores de faenas
-- Ejecutar en phpMyAdmin o MySQL Workbench

-- Paleta de colores recomendada para faenas mineras:

-- Verde esmeralda (actualmente en Cabildo)
UPDATE faenas SET color = '#10b981' WHERE ubicacion = 'Cabildo';

-- Azul profundo (representa agua, mar)
-- UPDATE faenas SET color = '#3b82f6' WHERE ubicacion = 'Faena Norte';

-- Rojo intenso (representa tierra, mineral)
-- UPDATE faenas SET color = '#ef4444' WHERE ubicacion = 'Faena Sur';

-- Amarillo dorado (representa oro, minerales preciosos)
-- UPDATE faenas SET color = '#f59e0b' WHERE ubicacion = 'Faena Central';

-- Púrpura (representa calidad, premium)
-- UPDATE faenas SET color = '#8b5cf6' WHERE ubicacion = 'Faena Este';

-- Naranja (color por defecto del sistema)
-- UPDATE faenas SET color = '#f97316' WHERE ubicacion = 'Faena Oeste';

-- Turquesa (representa tecnología, modernidad)
-- UPDATE faenas SET color = '#06b6d4' WHERE ubicacion = 'Faena Tech';

-- Magenta (representa innovación)
-- UPDATE faenas SET color = '#ec4899' WHERE ubicacion = 'Faena Innovación';

-- Verde lima (representa crecimiento)
-- UPDATE faenas SET color = '#84cc16' WHERE ubicacion = 'Faena Crecimiento';

-- Índigo oscuro (representa experiencia)
-- UPDATE faenas SET color = '#4f46e5' WHERE ubicacion = 'Faena Experiencia';

-- Ver todas las faenas con sus colores actuales
SELECT id, ubicacion, color, estado FROM faenas ORDER BY ubicacion;

-- NOTA: Descomenta las líneas que necesites según los nombres de tus faenas
