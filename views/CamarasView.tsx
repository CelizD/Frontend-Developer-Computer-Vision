import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import CameraFeed from '../components/ui/CameraFeed';
import FeedSkeleton from '../components/ui/FeedSkeleton';
import CameraStatusIcon from '../components/ui/CameraStatusIcon';
import { RoomMetric } from '../types/global.d';

const Cameras = () => {
  const { liveMetrics, t, isLoading } = useAppContext();
  const [viewMode, setViewMode] = useState<'video' | 'heatmap'>('video');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredMetrics = useMemo(() => {
    return liveMetrics.filter((m: RoomMetric) =>
      m.room.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [liveMetrics, searchQuery]);

  return (
    <>
      <PageHeader />

      {/* Controles Superiores */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        {/* Búsqueda */}
        <input
          type="text"
          placeholder={t('cameras.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-80 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder-gray-500"
        />
        {/* Toggle de Vista */}
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
      
      {/* Grilla de Cámaras */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          // Mostrar Skeletons si está cargando
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
              <FeedSkeleton isMainFeed={false} />
            </div>
          ))
        ) : (
          filteredMetrics.length > 0 ? (
            filteredMetrics.map((metric) => (
              <div key={metric.room} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
                {/* Encabezado de la Tarjeta */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-semibold text-black dark:text-white">{metric.room}</h4>
                    <CameraStatusIcon status={metric.status} />
                  </div>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    metric.status === 'Alert' ? 'bg-red-500 text-white' :
                    metric.status === 'Offline' ? 'bg-gray-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {metric.percentage}%
                  </span>
                </div>

                {/* Feed de Cámara */}
                <CameraFeed metric={metric} isMainFeed={false} viewMode={viewMode} />

                {/* Información Adicional */}
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  {t('cameras.capacity')}: {metric.occupied}/{metric.total}
                </div>
              </div>
            ))
          ) : (
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