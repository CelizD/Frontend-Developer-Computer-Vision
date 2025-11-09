import React from 'react';

/**
 * Componente para mostrar una página 404 o mensaje de recurso no encontrado.
 * @param title - Título principal (por defecto "404")
 * @param description - Descripción o mensaje adicional (por defecto "Página no encontrada")
 */
const NotFound = ({
  title = '404',
  description = 'Página no encontrada'
}: {
  title?: string;
  description?: string;
}) => (
  <div className="p-8 text-center">
    {/* Título grande */}
    <h2 className="text-3xl font-bold mb-2">{title}</h2>

    {/* Descripción o mensaje secundario */}
    <p className="text-gray-600">{description}</p>
  </div>
);

export default NotFound;
