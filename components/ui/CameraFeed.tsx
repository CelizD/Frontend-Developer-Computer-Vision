import React from 'react';
import { RoomMetric } from '../../types/global.d';

// Props del componente
type Props = {
  metric?: RoomMetric;          // Métrica de la sala (ocupación, total, nombre)
  isMainFeed?: boolean;         // Indica si este feed es el principal (afecta tamaño)
  viewMode?: 'video' | 'heatmap'; // Modo de visualización: video o heatmap
};

const CameraFeed: React.FC<Props> = ({ metric, isMainFeed = false, viewMode = 'video' }) => {
  // Si no se recibe una métrica, mostrar mensaje por defecto
  if (!metric) return <div className="text-sm text-gray-500">No camera</div>;

  return (
    <div
      className={`w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center ${
        isMainFeed ? 'h-56' : ''
      }`}
    >
      {/* Información simulada de la sala */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-300">
        {/* Nombre de la sala */}
        <div className="font-medium">{metric.room}</div>
        {/* Ocupación actual / total */}
        <div className="text-xs">{metric.occupied}/{metric.total} occupied</div>
        {/* Indicador del modo de visualización */}
        <div className="mt-2 text-xs">
          {viewMode === 'video' ? 'Live video (stub)' : 'Heatmap (stub)'}
        </div>
      </div>
    </div>
  );
};

export default CameraFeed;
