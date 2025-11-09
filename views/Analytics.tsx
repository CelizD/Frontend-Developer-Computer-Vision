import React, { useState } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { useAppContext } from '../context/AppContext'; // Contexto global
import PageHeader from '../components/PageHeader'; // Componente de encabezado de página
import ChartSkeleton from '../components/ui/ChartSkeleton'; // Componente placeholder mientras carga
import { useAnalyticsChartData } from '../hooks/useAnalyticsChartData'; // Hook personalizado para procesar datos de gráficos

const Analytics = () => {
  // Extraer datos, tema, traducciones y estados desde el contexto
  const { historicalData, liveMetrics, theme, t, isLoading, eventLog } = useAppContext(); 

  // Estados locales para seleccionar rango de tiempo y métrica
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'semester'>('week');
  const [selectedMetric, setSelectedMetric] = useState('global');
  
  // Consumir hook personalizado para generar datos y opciones de los gráficos
  const {
    lineChartOptions,  // Opciones del gráfico de línea
    barChartOptions,   // Opciones del gráfico de barras
    historicalChartData, // Datos formateados para el gráfico de línea
    doughnutData,      // Datos del gráfico de dona
    barAlertsData,     // Datos del gráfico de barras de alertas
    doughnutOptions    // Opciones del gráfico de dona
  } = useAnalyticsChartData({
      historicalData,
      liveMetrics,
      theme,
      t,
      eventLog,
      selectedTimeframe,
      selectedMetric
  });

  return (
    <>
      {/* Encabezado de la página */}
      <PageHeader 
          title={t('nav.analitica')}
          subtitle={t('views.analyticsDesc')}
      />

      {/* Gráfico principal: Tendencia histórica */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 mb-6 shadow-lg">
        {/* Título y selectores */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h3 className="text-xl font-semibold text-black dark:text-white">{t('analytics.historicalTrend')}</h3>
          
          {/* Selectores de métrica y tiempo */}
          <div className="flex gap-3">
            {/* Selector de Métrica */}
            <select
              value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white text-sm"
            >
              <option value="global">{t('analytics.global')}</option>
              {liveMetrics.map(m => <option key={m.room} value={m.room}>{m.room}</option>)}
            </select>
            {/* Selector de Tiempo */}
            <select
              value={selectedTimeframe} onChange={(e) => setSelectedTimeframe(e.target.value as 'week' | 'month' | 'semester')}
              className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white text-sm"
            >
              <option value="week">{t('analytics.timeframe.week')}</option>
              <option value="month">{t('analytics.timeframe.month')}</option>
              <option value="semester">{t('analytics.timeframe.semester')}</option>
            </select>
          </div>
        </div>
        
        {/* Contenedor del gráfico de línea */}
        <div style={{ height: 350 }}>
          {isLoading ? <ChartSkeleton /> : (
            historicalData.length > 0 ? (
              <Line data={historicalChartData} options={lineChartOptions} />
            ) : (
              <div className="text-center text-gray-400 py-24">{t('analytics.noData')}</div>
            )
          )}
        </div>
      </div>

      {/* Gráficos secundarios: Dona y barras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ocupación Promedio (Dona) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">{t('analytics.avgOccupancy')}</h3>
          <div style={{ height: 350 }}>
            {isLoading ? <ChartSkeleton /> : (
              historicalData.length > 0 ? (
                <Doughnut data={doughnutData} options={doughnutOptions} />
              ) : (
                <div className="text-center text-gray-400 py-24">{t('analytics.noData')}</div>
              )
            )}
          </div>
        </div>

        {/* Gráfico de Conteo de Alertas (Barra) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">{t('analytics.alertCount')}</h3>
          <div style={{ height: 350 }}>
            {isLoading ? <ChartSkeleton /> : (
              liveMetrics.length > 0 ? (
                <Bar data={barAlertsData} options={barChartOptions} />
              ) : (
                <div className="text-center text-gray-400 py-24">{t('analytics.noData')}</div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
