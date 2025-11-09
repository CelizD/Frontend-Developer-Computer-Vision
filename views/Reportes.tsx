import React from 'react';
import { useAppContext } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import { RoomMetric } from '../types/global.d'; // Asegurar la importación del tipo

const Reports = () => {
  const { metrics, userRole, t } = useAppContext();
  
  const handleGenerateReport = () => {
    // CORRECCIÓN: Obtener el valor del filtro de sala del DOM
    const roomFilter = (document.getElementById('report-room') as HTMLSelectElement)?.value;

    // Los filtros de fecha se ignoran ya que `metrics` es solo estado actual (live)
    let metricsToReport: RoomMetric[] = metrics;

    // Aplicar el filtro de sala si no es 'all'
    if (roomFilter && roomFilter !== 'all') {
        metricsToReport = metrics.filter(m => m.room === roomFilter);
    }
    
    const headers = t('reports.csvHeaders').split(',');
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    
    // Usar la lista filtrada
    metricsToReport.forEach(row => {
      // Asegurarse de que el estado esté traducido para el reporte
      const statusText = t(`cameras.status.${row.status === 'Luz Baja' ? 'lowLight' : row.status.toLowerCase()}`);
      csvContent += `${row.room},${row.occupied},${row.total},${row.percentage}%,${statusText}\n`;
    });
    
    // Manejar el caso de que no haya datos para exportar
    if (metricsToReport.length === 0) {
        alert(t('reports.noDataExport'));
        return;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reporte_asistencia_${roomFilter === 'all' ? 'global' : roomFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <PageHeader />
      
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-2xl shadow-lg">
        <h3 className="font-semibold mb-4 text-black dark:text-white text-xl">{t('reports.generate')}</h3>
        
        {/* Filtros de Reporte (UI/Simulados) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="report-start-date" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('analytics.startDate')}</label>
            {/* NOTA: Estos campos no se usan para la generación actual, pero se mantienen por UI */}
            <input type="date" id="report-start-date" defaultValue={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white" />
          </div>
          <div>
            <label htmlFor="report-end-date" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('analytics.endDate')}</label>
            <input type="date" id="report-end-date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="report-room" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('analytics.filterRoom')}</label>
            <select id="report-room" className="w-full p-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-black dark:text-white">
              <option value="all">{t('analytics.allRooms')}</option>
              {metrics.map(m => <option key={m.room} value={m.room}>{m.room}</option>)}
            </select>
          </div>
        </div>
        
        {userRole !== 'viewer' ? (
          <button 
            onClick={handleGenerateReport} 
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors w-full"
          >
            {t('reports.button')}
          </button>
        ) : (
            <p className="text-yellow-500 dark:text-yellow-400 text-center text-sm">{t('sidebar.viewer')} {t('views.reportsDesc').toLowerCase()}.</p>
        )}
      </section>
    </>
  );
};

export default Reports;  