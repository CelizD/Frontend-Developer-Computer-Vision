import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import './SecureCamera.css';

const SecureCamera = ({ onStreamReady, onError }) => {
  const [cameraType, setCameraType] = useState('webcam'); // 'webcam', 'ip', 'rtsp'
  const [authRequired, setAuthRequired] = useState(false);
  const [cameraConfig, setCameraConfig] = useState({
    url: '',
    username: '',
    password: '',
    deviceId: '',
    authType: 'basic'
  });
  const [devices, setDevices] = useState([]);
  const webcamRef = useRef(null);
  const videoRef = useRef(null);

  // 1. Enumerar dispositivos disponibles
  useEffect(() => {
    const getDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        
        if (videoDevices.length > 0 && !cameraConfig.deviceId) {
          setCameraConfig(prev => ({
            ...prev,
            deviceId: videoDevices[0].deviceId
          }));
        }
      } catch (error) {
        console.error('Error enumerando dispositivos:', error);
      }
    };
    
    getDevices();
  }, []);

  // 2. Manejar conexión de webcam
  const connectWebcam = async () => {
    try {
      const constraints = {
        video: {
          deviceId: cameraConfig.deviceId ? { exact: cameraConfig.deviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (webcamRef.current) {
        webcamRef.current.video.srcObject = stream;
        if (onStreamReady) {
          onStreamReady(stream);
        }
      }
    } catch (error) {
      console.error('Error de webcam:', error);
      
      // Detectar si es error de autenticación
      if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
        setAuthRequired(true);
      }
      
      if (onError) {
        onError(error.message);
      }
    }
  };

  // 3. Manejar conexión de cámara IP
  const connectIPCamera = async () => {
    if (!cameraConfig.url) {
      alert('Por favor ingresa la URL de la cámara');
      return;
    }

    try {
      let streamUrl = cameraConfig.url;
      
      // Construir URL con credenciales si existen
      if (cameraConfig.username && cameraConfig.password) {
        try {
          const url = new URL(cameraConfig.url);
          url.username = cameraConfig.username;
          url.password = cameraConfig.password;
          streamUrl = url.toString();
        } catch (e) {
          // Formato simple si no es URL válida
          const protocol = cameraConfig.url.split('://')[0];
          const rest = cameraConfig.url.split('://')[1];
          streamUrl = `${protocol}://${cameraConfig.username}:${cameraConfig.password}@${rest}`;
        }
      }

      // Para video elemento
      if (videoRef.current) {
        videoRef.current.src = streamUrl;
        videoRef.current.crossOrigin = 'use-credentials';
        
        videoRef.current.onloadeddata = () => {
          console.log('Cámara IP conectada exitosamente');
          if (onStreamReady) {
            // Crear MediaStream del elemento video
            const stream = videoRef.current.captureStream();
            onStreamReady(stream);
          }
        };
        
        videoRef.current.onerror = (e) => {
          console.error('Error de cámara IP:', e);
          
          // Si hay error, puede ser por autenticación
          if (!cameraConfig.username || !cameraConfig.password) {
            setAuthRequired(true);
          }
          
          if (onError) {
            onError('Error conectando a la cámara. Verifica URL y credenciales.');
          }
        };
      }
    } catch (error) {
      console.error('Error configurando cámara IP:', error);
      if (onError) {
        onError(error.message);
      }
    }
  };

  // 4. Manejar submit de autenticación
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthRequired(false);
    
    // Reconectar con las nuevas credenciales
    if (cameraType === 'webcam') {
      connectWebcam();
    } else {
      connectIPCamera();
    }
  };

  // 5. Renderizar formulario de autenticación
  const renderAuthModal = () => {
    if (!authRequired) return null;

    return (
      <div className="auth-modal-overlay">
        <div className="auth-modal">
          <h3>🔐 Autenticación Requerida</h3>
          <p>Esta cámara requiere credenciales de acceso</p>
          
          <form onSubmit={handleAuthSubmit}>
            <div className="form-group">
              <label htmlFor="username">Usuario:</label>
              <input
                type="text"
                id="username"
                value={cameraConfig.username}
                onChange={(e) => setCameraConfig({
                  ...cameraConfig,
                  username: e.target.value
                })}
                placeholder="Ingresa el usuario"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                value={cameraConfig.password}
                onChange={(e) => setCameraConfig({
                  ...cameraConfig,
                  password: e.target.value
                })}
                placeholder="Ingresa la contraseña"
                required
              />
            </div>
            
            <div className="modal-buttons">
              <button type="submit" className="btn-primary">
                Conectar
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setAuthRequired(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // 6. Renderizar controles de configuración
  const renderCameraControls = () => (
    <div className="camera-controls">
      <div className="camera-type-selector">
        <label>Tipo de Cámara:</label>
        <select
          value={cameraType}
          onChange={(e) => {
            setCameraType(e.target.value);
            setAuthRequired(false);
          }}
        >
          <option value="webcam">Webcam Local</option>
          <option value="ip">Cámara IP/HTTP</option>
        </select>
      </div>

      {cameraType === 'webcam' ? (
        <div className="webcam-config">
          <label>Seleccionar Cámara:</label>
          <select
            value={cameraConfig.deviceId}
            onChange={(e) => setCameraConfig({
              ...cameraConfig,
              deviceId: e.target.value
            })}
          >
            {devices.map((device, index) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Cámara ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="ip-camera-config">
          <div className="form-group">
            <label>URL de la Cámara:</label>
            <input
              type="text"
              value={cameraConfig.url}
              onChange={(e) => setCameraConfig({
                ...cameraConfig,
                url: e.target.value
              })}
              placeholder="Ej: http://192.168.1.100:8080/video"
              className="url-input"
            />
          </div>
          
          {(cameraConfig.username || cameraConfig.password) && (
            <div className="current-credentials">
              <small>
                Credenciales configuradas: {cameraConfig.username} 
                {cameraConfig.password ? ' •••••' : ''}
              </small>
            </div>
          )}
        </div>
      )}

      <div className="action-buttons">
        <button 
          onClick={cameraType === 'webcam' ? connectWebcam : connectIPCamera}
          className="connect-btn"
        >
          Conectar Cámara
        </button>
        
        <button 
          onClick={() => setAuthRequired(true)}
          className="auth-btn"
          disabled={cameraType === 'webcam' && !authRequired}
        >
          Configurar Credenciales
        </button>
      </div>
    </div>
  );

  return (
    <div className="secure-camera-container">
      <h2>📷 Cámara Segura con Autenticación</h2>
      
      {renderCameraControls()}
      
      <div className="camera-preview">
        {cameraType === 'webcam' ? (
          <div className="webcam-preview">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                deviceId: cameraConfig.deviceId,
                width: 640,
                height: 480
              }}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </div>
        ) : (
          <div className="ip-camera-preview">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ 
                width: '100%', 
                maxWidth: '640px',
                borderRadius: '8px',
                border: '2px solid #ddd'
              }}
            />
            {!cameraConfig.url && (
              <div className="placeholder">
                <p>Ingresa la URL de la cámara y haz clic en "Conectar"</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {renderAuthModal()}
      
      <div className="instructions">
        <h4>📋 Instrucciones:</h4>
        <ul>
          <li>Para webcam local: Selecciona el dispositivo y conéctate</li>
          <li>Para cámaras IP: Ingresa la URL completa (http://ip:puerto/ruta)</li>
          <li>Si la cámara requiere credenciales, haz clic en "Configurar Credenciales"</li>
          <li>Para cámaras RTSP, necesitarás un servidor proxy intermedio</li>
        </ul>
      </div>
    </div>
  );
};

export default SecureCamera;