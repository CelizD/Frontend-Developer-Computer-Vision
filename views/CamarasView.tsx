import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext'; // Contexto global
import PageHeader from '../components/PageHeader'; // Componente de encabezado de página
import CameraFeed from '../components/ui/CameraFeed'; // Componente que muestra la cámara o heatmap
import FeedSkeleton from '../components/ui/FeedSkeleton'; // Placeholder mientras carga el feed
import CameraStatusIcon from '../components/ui/CameraStatusIcon'; // Icono de estado de cámara
import { RoomMetric } from '../types/global.d'; // Tipos globales

const Cameras = () => {
  // Extraer métricas en tiempo real, traducciones y estado de carga desde el contexto
  const { liveMetrics, t, isLoading } = useAppContext();

  // Estado local para alternar entre vista de video o heatmap
  const [viewMode, setViewMode] = useState<'video' | 'heatmap'>('video');
  
  // Estado local para filtrar cámaras por nombre
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtrar métricas según el texto ingresado en la búsqueda
  const filteredMetrics = useMemo(() => {
    return liveMetrics.filter((m: RoomMetric) =>
      m.room.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [liveMetrics, searchQuery]);

  return (
    <>
      {/* Encabezado de la página */}
      <PageHeader />

      {/* Controles superiores: búsqueda y toggle de vista */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Input de búsqueda de cámaras */}
        <input
          type="text"
          placeholder={t('cameras.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-80 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder-gray-500"
        />
        {/* Toggle de vista (Video / Heatmap) */}
        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('video')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === 'video' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('cameras.videoView')}
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === 'heatmap' ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('cameras.heatmapView')}
          </button>
        </div>
      </div>
      
      {/* Grilla de cámaras */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          // Mostrar Skeletons si los datos aún se están cargando
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
              <FeedSkeleton isMainFeed={false} />
            </div>
          ))
        ) : (
          filteredMetrics.length > 0 ? (
            // Renderizar cada cámara filtrada
            filteredMetrics.map((metric) => (
              <div key={metric.room} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
                {/* Encabezado de la tarjeta de cámara */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-semibold text-black dark:text-white">{metric.room}</h4>
                    <CameraStatusIcon status={metric.status} />
                  </div>
                  {/* Indicador de porcentaje y estado */}
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    metric.status === 'Alert' ? 'bg-red-500 text-white' :
                    metric.status === 'Offline' ? 'bg-gray-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {metric.percentage}%
                  </span>
                </div>

                {/* Feed de la cámara (video o heatmap) */}
                <CameraFeed metric={metric} isMainFeed={false} viewMode={viewMode} />

                {/* Información adicional: ocupación */}
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  {t('cameras.capacity')}: {metric.occupied}/{metric.total}
                </div>
              </div>
            ))
          ) : (
            // Mensaje cuando no hay resultados
            <div className="col-span-full bg-white dark:bg-gray-800 p-10 rounded-2xl border border-gray-200 dark:border-gray-700 text-center text-gray-500">
              {t('cameras.noResults')}
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Cameras;
