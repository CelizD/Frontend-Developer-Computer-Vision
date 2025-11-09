import React from 'react';
import { useAppContext } from '../context/AppContext';
import PageHeader from '../components/PageHeader'; // Encabezado de página reutilizable
import GeneralSettings from '../components/settings/GeneralSettings'; // Configuración general (tema, umbral, notificaciones)
import ManageRooms from '../components/settings/ManageRooms'; // Gestión de aulas (CRUD)
import ManageUsers from '../components/settings/ManageUsers'; // Gestión de usuarios (CRUD, solo admin)

/**
 * Componente principal de Configuraciones
 * Organiza las secciones de ajustes generales, gestión de aulas y usuarios
 */
const Settings = () => {
  const { t } = useAppContext(); // Traducciones y estado global

  return (
    <>
      {/* Encabezado de la página */}
      <PageHeader />

      {/* Sección de Configuración General y Gestión de Aulas */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna 1: Configuración General */}
        <GeneralSettings />

        {/* Columna 2: Gestión de Aulas */}
        <ManageRooms />
      </section>

      {/* Sección de Gestión de Usuarios (fila completa, visible solo para admins según lógica interna del subcomponente) */}
      <section className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
        <ManageUsers />
      </section>
    </>
  );
};

export default Settings;
