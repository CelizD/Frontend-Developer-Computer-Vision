import React from 'react';
// Importa el contexto global de la app (tema, traducciones y configuraciones)
import { useAppContext } from '../../context/AppContext';
import ToggleSwitch from '../ui/ToggleSwitch'; // Componente de switch/toggle reutilizable

const GeneralSettings: React.FC = () => {
  const { 
    t, theme, setTheme, 
    alertThreshold, setAlertThreshold,
    notificationEmail, setNotificationEmail, 
    enableEmailNotifications, setEnableEmailNotifications,
    dashboardWidgets, setDashboardWidgets
  } = useAppContext();

  // Cambia el tema entre light y dark
  const handleThemeChange = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Cambia el valor del umbral de alertas
  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlertThreshold(parseInt(e.target.value, 10));
  };
  
  // Cambia el toggle de notificaciones por email
  const handleEmailToggle = () => {
    setEnableEmailNotifications(!enableEmailNotifications);
  };
  
  // Actualiza el email de notificación
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationEmail(e.target.value);
  };

  // Cambia el estado de visibilidad de un widget del dashboard
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

      {/* Umbral de alertas */}
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

      {/* Configuración de notificaciones */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">{t('settings.notifications')}</h3>
        <div className="space-y-4">
          
          {/* Input de Email de notificación */}
          <div>
            <label htmlFor="notif-email" className="block text-sm font-medium mb-1">
              {t('settings.notifEmail')}
            </label>
            <input
              id="notif-email"
              type="email"
              value={notificationEmail}
              onChange={handleEmailChange}
              placeholder="email@institucion.com"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Toggle de Notificaciones por correo */}
          <div className="flex items-center justify-between">
            <div className="font-medium">
              {t('settings.notifToggle')}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {t('settings.notifDescription')}
              </p>
            </div>
            <ToggleSwitch
              id="email-notif"
              enabled={enableEmailNotifications}
              setEnabled={handleEmailToggle}
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
// Alias en español
export { GeneralSettings as ConfiguracionGeneral };
