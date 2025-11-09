import React from 'react';

const NotFound = ({ title = '404', description = 'Página no encontrada' }: { title?: string; description?: string }) => (
  <div className="p-8 text-center">
    <h2 className="text-3xl font-bold mb-2">{title}</h2>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default NotFound;
