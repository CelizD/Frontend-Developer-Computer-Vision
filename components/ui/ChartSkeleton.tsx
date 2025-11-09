import React from 'react';

const ChartSkeleton = () => (
  // Clase base para un esqueleto animado
  <div className="w-full h-[250px] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
    <p className="text-gray-400 dark:text-gray-500 text-sm">Cargando Gráfico...</p>
  </div>
);

export default ChartSkeleton;