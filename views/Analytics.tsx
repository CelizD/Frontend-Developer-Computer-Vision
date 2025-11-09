import React, { useMemo, useState } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { useAppContext } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import ChartSkeleton from '../components/ui/ChartSkeleton';

const Analytics = () => {
  const { historicalData, liveMetrics, theme, t, isLoading } = useAppContext();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'semester'>('week');
  const [selectedMetric, setSelectedMetric] = useState('global');
  
  // 1. Opciones de Gráfico (Ajuste de Tema)
  const lineChartOptions: ChartOptions<'line'> = useMemo(() => {
    const tickColor = theme === 'dark' ? "#d1d5db" : "#374151";
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: tickColor } }, title: { display: false } },
      scales: {
        x: { ticks: { color: tickColor }, grid: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' } },
        y: { beginAtZero: true, max: 100, ticks: { color: tickColor }, grid: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' } },
      },
    };
  }, [theme]);

  const barChartOptions: ChartOptions<'bar'> = useMemo(() => {
    const tickColor = theme === 'dark' ? "#d1d5db" : "#374151";
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: tickColor } }, title: { display: false } },
      scales: {
        x: { ticks: { color: tickColor }, grid: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' } },
        y: { beginAtZero: true, max: 100, ticks: { color: tickColor }, grid: { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' } },
      },
    };
  }, [theme]);
  
  // 2. Datos Filtrados para Gráfico de Tendencia Histórica (Line)
  const historicalChartData = useMemo(() => {
    // Filtrar los datos por el rango de tiempo
    const timeframes = {
      week: 7, month: 30, semester: 180
    };
    const days = timeframes[selectedTimeframe];
    const filteredData = historicalData.slice(-days); // Tomar los últimos 'days' registros

    const labels = filteredData.map(d => new Date(d.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }));
    
    const getMetricData = (data: any, metric: string) => {
      if (metric === 'global') {
        return data.map((d: any) => d.globalPercent);
      } else {
        return data.map((d: any) => d.rooms[metric] ? d.rooms[metric].percentage : 0);
      }
    };

    return {
      labels,
      datasets: [{
        label: selectedMetric === 'global' ? t('analytics.globalAttendance') : selectedMetric,
        data: getMetricData(filteredData, selectedMetric),
        fill: true,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
      }],
    };
  }, [historicalData, selectedTimeframe, selectedMetric, t]);

  // 3. Datos para Gráfico de Ocupación Promedio (Doughnut)
  const doughnutData = useMemo(() => {
    const totalMetrics = historicalData.reduce((acc, dailyData) => {
      for (const room in dailyData.rooms) {
        acc[room] = (acc[room] || 0) + dailyData.rooms[room].percentage;
      }
      return acc;
    }, {} as Record<string, number>);
  
    const roomNames = Object.keys(totalMetrics);
    const avgPercentages = roomNames.map(room => Math.round(totalMetrics[room] / historicalData.length));

    return {
      labels: roomNames,
      datasets: [{
        data: avgPercentages,
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
        hoverOffset: 4,
      }],
    };
  }, [historicalData]);

  // 4. Datos para Gráfico de Alertas por Aula (Bar)
  const barAlertsData = useMemo(() => {
    const alertCounts = liveMetrics.reduce((acc, m) => {
      // Simulamos conteo de alertas históricas
      const count = Math.floor(Math.random() * 20);
      acc[m.room] = count;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(alertCounts),
      datasets: [{
        label: t('analytics.alerts'),
        data: Object.values(alertCounts),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        borderRadius: 4,
      }],
    };
  }, [liveMetrics, t]);
  
  // Opciones para Doughnut Chart (sin escalas)
  const doughnutOptions: ChartOptions<'doughnut'> = useMemo(() => {
    const tickColor = theme === 'dark' ? "#d1d5db" : "#374151";
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'right', labels: { color: tickColor, padding: 20 } } },
    };
  }, [theme]);


  return (
    <>
      <PageHeader />

      {/* Gráfico de Tendencia Histórica (Línea) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 mb-6 shadow-lg">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h3 className="text-xl font-semibold text-black dark:text-white">{t('analytics.historicalTrend')}</h3>
          
          {/* Selectores */}
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

      {/* Gráficos Secundarios (Dona y Barras) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ocupación Promedio (Doughnut) */}
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
          <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">{t('analytics.alertCount')} ({t('analytics.simulated')})</h3>
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