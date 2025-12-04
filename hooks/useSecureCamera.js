import { useState, useEffect, useCallback } from 'react';

const useSecureCamera = () => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraInfo, setCameraInfo] = useState({
    type: 'webcam',
    url: '',
    authenticated: false
  });

  // Limpiar stream cuando se desmonte
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Conectar a webcam local
  const connectWebcam = useCallback(async (deviceId = null) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const constraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(mediaStream);
      setCameraInfo({
        type: 'webcam',
        url: 'local',
        authenticated: true,
        deviceId: deviceId
      });
      
      return mediaStream;
    } catch (err) {
      const errorMsg = getFriendlyError(err);
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Conectar a cámara IP con autenticación
  const connectIPCamera = useCallback(async (url, username = '', password = '') => {
    setIsLoading(true);
    setError(null);
    
    try {
      let finalUrl = url;
      
      // Agregar credenciales a la URL si existen
      if (username && password) {
        try {
          const urlObj = new URL(url);
          urlObj.username = username;
          urlObj.password = password;
          finalUrl = urlObj.toString();
        } catch {
          // Fallback para URLs simples
          const protocol = url.split('://')[0];
          const host = url.split('://')[1];
          finalUrl = `${protocol}://${username}:${password}@${host}`;
        }
      }

      // Crear elemento video para probar la conexión
      const video = document.createElement('video');
      
      return new Promise((resolve, reject) => {
        video.src = finalUrl;
        video.crossOrigin = 'use-credentials';
        video.preload = 'auto';
        
        video.onloadeddata = () => {
          // Crear MediaStream desde el elemento video
          const mediaStream = video.captureStream();
          
          setStream(mediaStream);
          setCameraInfo({
            type: 'ip',
            url: url,
            authenticated: !!username,
            username: username
          });
          
          setIsLoading(false);
          resolve(mediaStream);
        };
        
        video.onerror = () => {
          setIsLoading(false);
          const errorMsg = 'Error conectando a la cámara. Verifica: 1) URL correcta, 2) Credenciales, 3) CORS habilitado';
          setError(errorMsg);
          reject(new Error(errorMsg));
        };
        
        // Timeout después de 10 segundos
        setTimeout(() => {
          if (!stream) {
            setIsLoading(false);
            const errorMsg = 'Timeout: La cámara no respondió';
            setError(errorMsg);
            reject(new Error(errorMsg));
          }
        }, 10000);
      });
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      throw err;
    }
  }, []);

  // Detener la cámara
  const disconnectCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraInfo({
        type: 'webcam',
        url: '',
        authenticated: false
      });
    }
  }, [stream]);

  // Obtener dispositivos disponibles
  const getAvailableDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch (err) {
      console.error('Error obteniendo dispositivos:', err);
      return [];
    }
  }, []);

  // Obtener error amigable
  const getFriendlyError = (error) => {
    switch(error.name) {
      case 'NotAllowedError':
        return 'Permiso denegado. Por favor permite el acceso a la cámara.';
      case 'NotFoundError':
        return 'No se encontró ninguna cámara conectada.';
      case 'NotReadableError':
        return 'La cámara está siendo usada por otra aplicación.';
      case 'SecurityError':
        return 'Error de seguridad. Verifica que estés en HTTPS.';
      case 'AbortError':
        return 'La conexión fue abortada.';
      default:
        return `Error: ${error.message}`;
    }
  };

  return {
    stream,
    error,
    isLoading,
    cameraInfo,
    connectWebcam,
    connectIPCamera,
    disconnectCamera,
    getAvailableDevices,
    setError
  };
};

export default useSecureCamera;