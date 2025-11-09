import React, { useMemo } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { useAppContext } from '../context/AppContext';
import PageHeader from '../components/PageHeader'; // Importar el encabezado de página
import CameraFeed from '../components/ui/CameraFeed'; // Asumimos que se mueve a ui/
import CameraStatusIcon from '../components/ui/CameraStatusIcon'; // Asumimos que se mueve a ui/
import ChartSkeleton from '../components/ui/ChartSkeleton'; // Importar Skeleton
import FeedSkeleton from '../components/ui/FeedSkeleton';

const Dashboard = () => {
  const { 
    liveMetrics, selectedRoom, setSelectedRoom, isPaused, handlePauseToggle, 
    theme, t, dashboardWidgets, isLoading
  } = useAppContext();
  
  const metrics = liveMetrics; // Usamos liveMetrics del contexto

  // 1. Cálculo de Métricas Globales
  const { globalPercent, totalOccupied, totalCapacity } = useMemo(() => {
    const stats = metrics.reduce((acc, m) => {
      acc.occupied += m.occupied;
      acc.total += m.total;
      return acc;
    }, { occupied: 0, total: 0 });
    const percent = stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0;
    return { globalPercent: percent, totalOccupied: stats.occupied, totalCapacity: stats.total };
  }, [metrics]);

  // 2. Datos para Gráfico de Barras (Asistencia por Aula)
  const barData = useMemo(() => ({
    labels: metrics.map((m) => m.room),
    datasets: [{
      label: t('charts.attendanceLabel'),
      data: metrics.map((m) => m.percentage),
      backgroundColor: metrics.map(m => m.percentage >= 90 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(59, 130, 246, 0.7)'),
      borderColor: metrics.map(m => m.percentage >= 90 ? 'rgb(239, 68, 68)' : 'rgb(59, 130, 246)'),
      borderWidth: 1,
      borderRadius: 6,
      barThickness: 22,
    }],
  }), [metrics, t]);

  // 3. Datos para Gráfico de Líneas (Tendencia Global)
  const lineData = useMemo(() => {
    const labels = [t('charts.days.ago6'), t('charts.days.ago5'), t('charts.days.ago4'), t('charts.days.ago3'), t('charts.days.ago2'), t('charts.days.today')];
    const data = [globalPercent * 0.8, globalPercent * 0.9, globalPercent * 0.85, globalPercent * 0.95, globalPercent * 1.05, globalPercent]
      .map(p => Math.min(Math.max(Math.round(p), 0), 100));
    return {
      labels,
      datasets: [{
        label: t('charts.trendLabel'),
        data: data,
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      }],
    };
  }, [globalPercent, t]);

	// 4. Opciones de Gráfico (Ajuste de Tema) - use specific option types per chart
	const barOptions: ChartOptions<'bar'> = useMemo(() => {
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

	const lineOptions: ChartOptions<'line'> = useMemo(() => {
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
  
  // 5. Métrica de Aula Seleccionada
  const selectedMetric = useMemo(() => {
    return metrics.find(m => m.room === selectedRoom) || metrics[0];
  }, [metrics, selectedRoom]);

  return (
    <>
      {/* Encabezado de Página - Visible en escritorio, oculto en móvil gracias a MobileHeader */}
      <header className="hidden lg:flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-black dark:text-white">{t('views.dashboard')}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t('views.dashboardDesc')}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.globalAttendance')} ({isPaused ? t('dashboard.paused') : t('dashboard.online')})</div>
            <div className="text-2xl font-bold text-black dark:text-white">{globalPercent}%</div>
          </div>
          {/* El botón de Pausa está en MobileHeader para móvil y aquí para escritorio */}
          <button
            onClick={handlePauseToggle}
            className={`px-3 py-2 rounded-md transition-colors ${isPaused ? 'bg-green-600 hover:bg-green-500' : 'bg-yellow-500 hover:bg-yellow-400'} text-white`}
          >
            {isPaused ? t('dashboard.resume') : t('dashboard.pause')}
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Gráficos */}
        <div className="lg:col-span-2 space-y-6">
          {dashboardWidgets.showAttendance && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-2 text-black dark:text-white">{t('dashboard.attendanceChart')}</h3>
              <div style={{ height: 250 }}>
                {isLoading ? <ChartSkeleton /> : (
                  metrics.length > 0 ? (
									<Bar data={barData} options={{ ...barOptions, onClick: (e, elements) => {
											if (elements.length > 0) setSelectedRoom(metrics[elements[0].index].room);
										}}} />
                  ) : (
                    <div className="text-center text-gray-400 py-24">{t('dashboard.loadingChart')}</div>
                  )
                )}
              </div>
            </div>
          )}
          
          {dashboardWidgets.showTrend && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-2 text-black dark:text-white">{t('dashboard.trendChart')}</h3>
              <div style={{ height: 250 }}>
                {isLoading ? <ChartSkeleton /> : (
				  <Line data={lineData} options={lineOptions} />
                )}
              </div>
            </div>
          )}
          
          {!dashboardWidgets.showAttendance && !dashboardWidgets.showTrend && (
            <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl border border-gray-200 dark:border-gray-700 text-center text-gray-500">
export default Dashboard;
            </div>
          )}
        </div>

        {/* Columna Derecha: Vista de Cámara y Lista de Aulas */}
        <aside className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-black dark:text-white">{t('dashboard.camera')}: {selectedMetric?.room}</h3>
            {isLoading ? <FeedSkeleton isMainFeed={true} /> : (
              <CameraFeed metric={selectedMetric} isMainFeed={true} />
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-3 text-black dark:text-white">{t('dashboard.roomList')} ({totalOccupied}/{totalCapacity})</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {metrics.map((m) => (
                <button
                  key={m.room}
                  onClick={() => setSelectedRoom(m.room)}
                  className={`p-3 rounded-lg text-left w-full transition-all duration-150 ${
                    selectedRoom === m.room 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" 
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700/80 text-black dark:text-white"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">{m.room}</div>
                      <div className={`text-xs ${selectedRoom === m.room ? 'text-gray-200' : 'text-gray-600 dark:text-gray-300'}`}>{m.occupied}/{m.total} {t('dashboard.occupied')}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CameraStatusIcon status={m.status} />
                      <div className="text-xl font-semibold">{m.percentage}%</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
