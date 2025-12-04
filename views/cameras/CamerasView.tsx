import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import CameraCard from '../../components/camera/CameraCard';
import CameraModal from '../../components/camera/CameraModal';
import './CamerasView.css';

const CamerasView: React.FC = () => {
  const {
    cameras,
    loadingCameras,
    refreshCameras,
    isCameraModalOpen,
    setIsCameraModalOpen,
    setEditingCamera
  } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar cámaras por búsqueda
  const filteredCameras = cameras.filter(camera =>
    camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    camera.ip.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCamera = () => {
    setEditingCamera(null);
    setIsCameraModalOpen(true);
  };

  const handleEditCamera = (camera: any) => {
    setEditingCamera(camera);
    setIsCameraModalOpen(true);
  };

  return (
    <div className="cameras-view">
      {/* Header */}
      <div className="cameras-header">
        <div>
          <h1>📹 Gestión de Cámaras</h1>
          <p>Administra tus cámaras IP conectadas al sistema</p>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn-refresh"
            onClick={refreshCameras}
            disabled={loadingCameras}
          >
            {loadingCameras ? '🔄 Cargando...' : '🔄 Actualizar'}
          </button>
          
          <button 
            className="btn-primary"
            onClick={handleAddCamera}
          >
            + Agregar Cámara
          </button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar cámaras por nombre o IP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="search-stats">
          <span>{filteredCameras.length} de {cameras.length} cámaras</span>
        </div>
      </div>

      {/* Lista de cámaras */}
      {loadingCameras ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando cámaras...</p>
        </div>
      ) : filteredCameras.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📹</div>
          <h3>No hay cámaras configuradas</h3>
          <p>Agrega tu primera cámara IP para comenzar</p>
          <button 
            className="btn-primary"
            onClick={handleAddCamera}
          >
            Agregar Cámara
          </button>
        </div>
      ) : (
        <div className="cameras-grid">
          {filteredCameras.map(camera => (
            <CameraCard
              key={camera.id}
              camera={camera}
              onEdit={handleEditCamera}
            />
          ))}
        </div>
      )}

      {/* Modal de cámara */}
      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
      />
    </div>
  );
};

export default CamerasView;