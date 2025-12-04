import React from 'react';

export interface Camera {
  id: string;
  name: string;
  ip: string;
  status?: 'online' | 'offline' | string;
}

interface CameraCardProps {
  camera: Camera;
  onEdit?: (camera: Camera) => void;
  onDelete?: (id: string) => void;
}

const CameraCard: React.FC<CameraCardProps> = ({ camera, onEdit, onDelete }) => {
  return (
    <div className="camera-card border rounded p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{camera.name}</h3>
          <p className="text-sm text-gray-500">{camera.ip}</p>
        </div>
        <div className="text-sm">
          <span className={camera.status === 'online' ? 'px-2 py-1 rounded bg-green-100 text-green-800' : 'px-2 py-1 rounded bg-red-100 text-red-800'}>
            {camera.status ?? 'unknown'}
          </span>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button className="btn btn-sm" onClick={() => onEdit?.(camera)}>Editar</button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete?.(camera.id)}>Eliminar</button>
      </div>
    </div>
  );
};

export default CameraCard;
