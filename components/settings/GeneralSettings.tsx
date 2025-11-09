import React from 'react';
import { useAppContext } from '../../context/AppContext';
import ToggleSwitch from '../ui/ToggleSwitch';

const GeneralSettings: React.FC = () => {
  const { 
    t, theme, setTheme, 
    alertThreshold, setAlertThreshold,
    notificationEmail, enableEmailNotifications,
    setDashboardWidgets, dashboardWidgets
  } = useAppContext();

  const handleThemeChange = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlertThreshold(parseInt(e.target.value, 10));
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

      {/* Configuración de Notificaciones */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">{t('settings.notifications')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{t('settings.notifToggle')}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{notificationEmail}</div>
            </div>
            <ToggleSwitch
              id="email-notif"
              enabled={enableEmailNotifications}
              setEnabled={() => {}}
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