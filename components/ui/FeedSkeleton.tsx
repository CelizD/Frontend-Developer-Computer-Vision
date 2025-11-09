import React from 'react';

// Props: indica si el feed es principal para ajustar altura
const FeedSkeleton = ({ isMainFeed }: { isMainFeed: boolean }) => {
  // Ajuste de altura según si es el feed principal o secundario
  const heightClass = isMainFeed ? 'h-60' : 'h-40';
  
  return (
    // Contenedor del esqueleto con animación de pulso
    <div className={`w-full ${heightClass} bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center`}>
      {/* Indicador de carga circular giratorio */}
      <div className="w-10 h-10 border-4 border-t-4 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default FeedSkeleton;
