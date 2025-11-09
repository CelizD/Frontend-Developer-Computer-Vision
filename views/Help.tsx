import React from 'react';
import { useAppContext } from '../context/AppContext'; // Importa el contexto global de la app
import PageHeader from '../components/PageHeader'; // Encabezado de página reutilizable

const Help = () => {
  // Extraemos funciones y variables del contexto (traducciones y tema actual)
  const { t, theme } = useAppContext();

  // Definimos los roles con su título, descripción y color de borde
  const roles = [
    { title: t('help.adminTitle'), desc: t('help.adminDesc'), color: 'border-blue-500' },
    { title: t('help.operatorTitle'), desc: t('help.operatorDesc'), color: 'border-green-500' },
    { title: t('help.viewerTitle'), desc: t('help.viewerDesc'), color: 'border-yellow-500' },
  ];

  return (
    <>
      {/* Encabezado de la página */}
      <PageHeader />
      
      {/* Sección principal del Help */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
        {/* Título de la sección */}
        <h3 className="font-semibold mb-4 text-black dark:text-white text-xl">{t('help.title')}</h3>
        
        {/* Lista de tarjetas de roles */}
        <div className="space-y-4">
          {roles.map(role => (
            // Tarjeta individual por rol
            <div 
              key={role.title} 
              className={`p-4 rounded-lg border-l-4 ${role.color} ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'}`}
            >
              {/* Título del rol */}
              <h4 className="font-semibold text-lg text-black dark:text-white">{role.title}</h4>
              {/* Descripción del rol */}
              <p className="text-gray-600 dark:text-gray-300">{role.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Help;
