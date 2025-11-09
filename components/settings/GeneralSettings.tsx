import React from 'react';
import { useAppContext } from '../../context/AppContext';
import ToggleSwitch from '../ui/ToggleSwitch';

const GeneralSettings: React.FC = () => {
  const { 
    t, theme, setTheme, 
    alertThreshold, setAlertThreshold,
    // CORRECCIÓN: Incluir los setters reales del contexto
    notificationEmail, setNotificationEmail, 
    enableEmailNotifications, setEnableEmailNotifications,
    setDashboardWidgets, dashboardWidgets
  } = useAppContext();

  const handleThemeChange = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlertThreshold(parseInt(e.target.value, 10));
  };
  
  // CORRECCIÓN: Handler para el toggle de notificaciones
  const handleEmailToggle = () => {
    setEnableEmailNotifications(!enableEmailNotifications);
  };
  
  // CORRECCIÓN: Handler para el cambio del email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationEmail(e.target.value);
  };

  const handleWidgetToggle = (widget: keyof typeof dashboardWidgets) => {
    setDashboardWidgets(prev => ({
      ...prev,
      [widget]: !prev[widget]
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4">{t('settings.general.title')}</h2>
      
      {/* Configuración de Tema */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{t('settings.theme')}</h3>
          <ToggleSwitch
            id="theme-toggle"
            enabled={theme === 'dark'}
            setEnabled={handleThemeChange}
          />
        </div>
      </div>

      {/* Umbral de Alertas */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">{t('settings.threshold')}</h3>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="50"
            max="100"
            value={alertThreshold}
            onChange={handleThresholdChange}
            className="w-full"
          />
          <span className="text-sm font-medium">{alertThreshold}%</span>
        </div>
      </div>

      {/* Configuración de Notificaciones (CORREGIDO) */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">{t('settings.notifications')}</h3>
        <div className="space-y-4">
          
          {/* Input de Email de Notificación */}
          <div>
            <label htmlFor="notif-email" className="block text-sm font-medium mb-1">
              {t('settings.notifEmail') /* Asumiendo esta clave para la etiqueta */}
            </label>
            <input
              id="notif-email"
              type="email"
              value={notificationEmail}
              onChange={handleEmailChange} // Conecta el cambio con el setter del contexto
              placeholder="email@institucion.com"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Toggle de Notificaciones por Correo */}
          <div className="flex items-center justify-between">
            <div className="font-medium">
              {t('settings.notifToggle')} 
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {t('settings.notifDescription')} {/* Asumiendo una clave de descripción */}
              </p>
            </div>
            <ToggleSwitch
              id="email-notif"
              enabled={enableEmailNotifications}
              setEnabled={handleEmailToggle} // Conecta el toggle con el setter del contexto
            />
          </div>
        </div>
      </div>

      {/* Widgets del Dashboard */}
      <div>
        <h3 className="text-lg font-medium mb-2">{t('settings.customize')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>{t('settings.showAttendance')}</span>
            <ToggleSwitch
              id="widget-attendance"
              enabled={dashboardWidgets.showAttendance}
              setEnabled={() => handleWidgetToggle('showAttendance')}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>{t('settings.showTrend')}</span>
            <ToggleSwitch
              id="widget-trend"
              enabled={dashboardWidgets.showTrend}
              setEnabled={() => handleWidgetToggle('showTrend')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
export { GeneralSettings as ConfiguracionGeneral };