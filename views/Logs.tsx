import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import { EventLog } from '../types/global.d';

const Logs = () => {
  const { eventLog, t } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<"all" | EventLog['level']>("all");

  const getLevelColor = (level: EventLog['level']) => {
    switch(level) {
      case 'alert': return 'text-red-500 dark:text-red-400';
      case 'warn': return 'text-yellow-500 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-300';
    }
  };
  
  // Lógica de Filtrado y Búsqueda
  const filteredLogs = useMemo(() => {
    return eventLog
      .filter(log => filterLevel === 'all' || log.level === filterLevel)
      .filter(log => {
        // Asegurar que el mensaje se traduzca antes de buscar
        const message = t(log.messageKey, log.messageArgs).toLowerCase();
        return message.includes(searchTerm.toLowerCase());
      });
  }, [eventLog, searchTerm, filterLevel, t]);

  return (
    <>
      <PageHeader />
      
      {/* Controles de Filtro */}
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <input 
          type="text"
          placeholder={t('logs.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder-gray-500"
        />
        <select 
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value as any)}
          className="p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white"
        >
          <option value="all">{t('logs.allLevels')}</option>
          <option value="alert">{t('logs.alert')}</option>
          <option value="warn">{t('logs.warn')}</option>
          <option value="info">{t('logs.info')}</option>
        </select>
      </div>
      
      {/* Lista de Logs */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-h-[70vh] overflow-y-auto">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredLogs.length > 0 ? filteredLogs.map(event => (
              <li key={event.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-gray-400 dark:text-gray-500 mr-2 text-xs">[{event.timestamp}]</span>
                <span className={`font-medium text-sm ${getLevelColor(event.level)}`}>[{t(`logs.${event.level}`)}]:</span>
                <span className="ml-2 text-black dark:text-white text-sm">{t(event.messageKey, event.messageArgs)}</span>
              </li>
            )) : (
              <li className="p-4 text-center text-gray-500 dark:text-gray-400">
                {t('logs.noEvents')}
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Logs;