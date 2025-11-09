import React from 'react';

interface ToggleSwitchProps {
  id: string;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, enabled, setEnabled }) => (
  <button 
    id={id} 
    onClick={() => setEnabled(!enabled)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
      enabled ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-600'
    }`}
    role="switch"
    aria-checked={enabled}
  >
    <span className="sr-only">Toggle</span>
    <span 
      aria-hidden="true"
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`} 
    />
  </button>
);

export default ToggleSwitch;