import React from 'react';

// Componente de esqueleto para gráficos mientras se cargan
const ChartSkeleton = () => (
  // Contenedor principal con animación de pulso (tailwind `animate-pulse`)
  <div className="w-full h-[250px] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
    {/* Texto indicativo de carga */}
    <p className="text-gray-400 dark:text-gray-500 text-sm">Cargando Gráfico...</p>
  </div>
);

export default ChartSkeleton;
