import React from 'react';
import { Camera } from '../../services/api';
import './CameraCard.css';

interface CameraCardProps {
  camera: Camera;
  onEdit: (camera: Camera) => void;
  onDelete?: (id: string) => void;
}

const CameraCard: React.FC<CameraCardProps> = ({ camera, onEdit }) => {
  const statusColors = {
    online: '#10B981',
    offline: '#EF4444',
    connecting: '#F59E0B'
  };

  const handleViewStream = () => {
    // Navegar a la vista de computer vision con esta cámara
    window.location.hash = `#/computer-vision?camera=${camera.id}`;
  };

  return (
    <div className="camera-card">
      {/* Header de la cámara */}
      <div className="camera-header">
        <div className="camera-status">
          <span 
            className="status-dot" 
            style={{ backgroundColor: statusColors[camera.status] }}
          />
          <span className="status-text">{camera.status === 'online' ? 'En línea' : 'Offline'}</span>
        </div>
        
        <button 
          className="btn-edit"
          onClick={() => onEdit(camera)}
        >
          ✏️
        </button>
      </div>

      {/* Información de la cámara */}
      <div className="camera-info">
        <h3 className="camera-name">{camera.name}</h3>
        
        <div className="camera-details">
          <div className="detail-item">
            <span className="detail-label">IP:</span>
            <span className="detail-value">{camera.ip}:{camera.port}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Usuario:</span>
            <span className="detail-value">{camera.username}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">RTSP:</span>
            <span className="detail-value truncate">{camera.rtsp_url}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Agregada:</span>
            <span className="detail-value">
              {new Date(camera.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="camera-actions">
        <button 
          className="btn-stream"
          onClick={handleViewStream}
          disabled={camera.status !== 'online'}
        >
          {camera.status === 'online' ? '👁️ Ver Stream' : '⏸️ Sin conexión'}
        </button>
      </div>
    </div>
  );
};

export default CameraCard;