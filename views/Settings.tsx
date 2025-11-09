import React from 'react';
import { useAppContext } from '../context/AppContext';
import PageHeader from '../components/PageHeader'; // Asumimos que se mueve a esta ubicación
import GeneralSettings from '../components/settings/GeneralSettings';
import ManageRooms from '../components/settings/ManageRooms';   // Importar subcomponente
import ManageUsers from '../components/settings/ManageUsers';   // Importar subcomponente

const Settings = () => {
  const { t } = useAppContext(); 

  return (
    <>
      {/* Encabezado (ahora centralizado) */}
      <PageHeader />
      
      {/* Sección de Configuración General y Aulas (2 columnas) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna 1: General Settings (Tema, Umbral, Notificaciones) */}
        <GeneralSettings />
        
        {/* Columna 2: Gestión de Aulas (CRUD) */}
        <ManageRooms />
      </section>
      
      {/* Sección de Gestión de Usuarios (Fila Completa, Solo Admin) */}
      <section className={`mt-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700`}>
        <ManageUsers />
      </section>
    </>
  );
};

export default Settings;