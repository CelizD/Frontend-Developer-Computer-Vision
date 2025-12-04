import React from 'react';

const ComputerVisionView: React.FC = () => {
  return (
    <div>
      <h2>Visión por Computadora</h2>
      <p>Interfaz para las funciones de Computer Vision.</p>
    </div>
  );
};

export default ComputerVisionView;
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import SecureCamera from '../../components/camera/SecureCamera';
import './ComputerVisionView.css';

const ComputerVisionView: React.FC = () => {
  const {
    cameras,
    selectedCamera,
    setSelectedCamera,
    currentView,
    setCurrentView
  } = useAppContext();

  const [activeModel, setActiveModel] = useState('coco-ssd');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Obtener parámetros de URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cameraId = params.get('camera');
    
    if (cameraId) {
      const camera = cameras.find(c => c.id === cameraId);
      if (camera) {
        setSelectedCamera(camera);
      }
    }
  }, [cameras, setSelectedCamera]);

  // Conectar a la cámara seleccionada
  const connectToCamera = async () => {
    if (!selectedCamera) return;

    try {
      setIsStreaming(true);
      
      // En un sistema real, aquí obtendrías el stream URL del backend
      // const streamUrl = await cameraService.getCameraStreamUrl(selectedCamera.id);
      
      // Por ahora, construimos la URL directamente
      const url = `rtsp://${selectedCamera.username}:${selectedCamera.password}@${selectedCamera.ip}:${selectedCamera.port}${selectedCamera.rtsp_url}`;
      setStreamUrl(url);
      
      // Aquí deberías integrar el componente SecureCamera con esta URL
    } catch (error) {
      console.error('Error conectando a la cámara:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  // Si no hay cámaras, redirigir a la vista de cámaras
  useEffect(() => {
    if (cameras.length === 0 && currentView === 'computer-vision') {
      setCurrentView('cameras');
    }
  }, [cameras, currentView, setCurrentView]);

  return (
    <div className="computer-vision-view">
      {/* Header */}
      <div className="cv-header">
        <div className="cv-header-left">
          <h1>👁️ Computer Vision Pro</h1>
          <p>Visualización y análisis en tiempo real</p>
        </div>
        
        <div className="cv-header-right">
          {/* Selector de cámara */}
          <div className="camera-selector">
            <label>Seleccionar Cámara:</label>
            <select
              value={selectedCamera?.id || ''}
              onChange={(e) => {
                const camera = cameras.find(c => c.id === e.target.value);
                setSelectedCamera(camera || null);
              }}
              className="camera-select"
            >
              <option value="">-- Selecciona una cámara --</option>
              {cameras.map(camera => (
                <option key={camera.id} value={camera.id}>
                  {camera.name} ({camera.ip})
                </option>
              ))}
            </select>
          </div>
          
          {/* Selector de modelo */}
          <div className="model-selector">
            <label>Modelo de IA:</label>
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
              className="model-select"
            >
              <option value="coco-ssd">COCO-SSD (Objetos)</option>
              <option value="posenet">PoseNet (Posturas)</option>
              <option value="facemesh">FaceMesh (Rostros)</option>
              <option value="handpose">HandPose (Manos)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="cv-content">
        {selectedCamera ? (
          <>
            {/* Información de la cámara */}
            <div className="camera-info-panel">
              <h3>📹 {selectedCamera.name}</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">IP:</span>
                  <span className="info-value">{selectedCamera.ip}:{selectedCamera.port}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Estado:</span>
                  <span className={`status-badge ${selectedCamera.status}`}>
                    {selectedCamera.status === 'online' ? '✅ En línea' : '❌ Offline'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">RTSP:</span>
                  <span className="info-value truncate">{selectedCamera.rtsp_url}</span>
                </div>
              </div>
              
              <button 
                className="btn-connect"
                onClick={connectToCamera}
                disabled={isStreaming || selectedCamera.status !== 'online'}
              >
                {isStreaming ? 'Conectando...' : '🔗 Conectar al Stream'}
              </button>
            </div>

            {/* Visualización del video */}
            <div className="video-container">
              {streamUrl ? (
                <SecureCamera 
                  streamUrl={streamUrl}
                  cameraConfig={{
                    username: selectedCamera.username,
                    password: selectedCamera.password,
                    type: 'rtsp'
                  }}
                  modelType={activeModel}
                />
              ) : (
                <div className="video-placeholder">
                  <div className="placeholder-icon">📹</div>
                  <h3>Selecciona una cámara y haz clic en "Conectar"</h3>
                  <p>El stream RTSP se mostrará aquí con análisis en tiempo real</p>
                </div>
              )}
            </div>

            {/* Panel de análisis */}
            <div className="analysis-panel">
              <h3>📊 Análisis en Tiempo Real</h3>
              <div className="analysis-stats">
                <div className="stat-card">
                  <div className="stat-icon">👤</div>
                  <div className="stat-content">
                    <span className="stat-label">Personas detectadas</span>
                    <span className="stat-value">0</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-content">
                    <span className="stat-label">Precisión del modelo</span>
                    <span className="stat-value">95%</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⚡</div>
                  <div className="stat-content">
                    <span className="stat-label">FPS</span>
                    <span className="stat-value">30</span>
                  </div>
                </div>
              </div>
              
              <div className="detections-log">
                <h4>Últimas detecciones:</h4>
                <div className="log-empty">
                  <p>Esperando detecciones...</p>
                  <small>Los objetos aparecerán aquí cuando sean detectados</small>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="no-camera-selected">
            <div className="selection-prompt">
              <div className="prompt-icon">📹</div>
              <h3>Selecciona una cámara para comenzar</h3>
              <p>Elige una cámara de la lista para ver el stream y análisis en tiempo real</p>
              <button 
                className="btn-primary"
                onClick={() => setCurrentView('cameras')}
              >
                Ir a Gestión de Cámaras
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComputerVisionView;