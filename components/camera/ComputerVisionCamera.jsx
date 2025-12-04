import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import SecureCamera from './SecureCamera';
import './ComputerVisionCamera.css';

const ComputerVisionCamera = ({ modelType = 'coco-ssd' }) => {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // 1. Cargar el modelo de TensorFlow.js
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsProcessing(true);
        
        let loadedModel;
        switch(modelType) {
          case 'coco-ssd':
            loadedModel = await tf.loadGraphModel(
              'https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1'
            );
            break;
          case 'posenet':
            loadedModel = await tf.loadGraphModel(
              'https://tfhub.dev/tensorflow/tfjs-model/posenet/mobilenet/float/050/1/default/1'
            );
            break;
          default:
            throw new Error('Modelo no soportado');
        }
        
        setModel(loadedModel);
        console.log('Modelo cargado exitosamente');
      } catch (error) {
        console.error('Error cargando modelo:', error);
      } finally {
        setIsProcessing(false);
      }
    };
    
    loadModel();
    
    return () => {
      if (model) {
        model.dispose();
      }
    };
  }, [modelType]);

  // 2. Manejar stream listo desde SecureCamera
  const handleStreamReady = (newStream) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    setStream(newStream);
    
    if (videoRef.current) {
      videoRef.current.srcObject = newStream;
      videoRef.current.play();
    }
    
    // Iniciar detección
    if (model) {
      startDetection();
    }
  };

  // 3. Iniciar detección en tiempo real
  const startDetection = () => {
    if (!videoRef.current || !model || !canvasRef.current) return;
    
    const detectFrame = async () => {
      if (videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
        animationRef.current = requestAnimationFrame(detectFrame);
        return;
      }
      
      try {
        // Crear tensor desde el video
        const tensor = tf.browser.fromPixels(videoRef.current);
        
        // Realizar predicción según el modelo
        let results;
        if (modelType === 'coco-ssd') {
          // Para detección de objetos
          results = await model.executeAsync(tensor.expandDims());
          
          // Procesar resultados
          const boxes = await results[0].array();
          const classes = await results[1].array();
          const scores = await results[2].array();
          
          const newPredictions = [];
          for (let i = 0; i < scores[0].length; i++) {
            if (scores[0][i] > 0.5) {
              newPredictions.push({
                bbox: boxes[0][i],
                class: classes[0][i],
                score: scores[0][i]
              });
            }
          }
          
          setPredictions(newPredictions);
          drawPredictions(newPredictions);
        }
        
        // Limpiar tensores
        tensor.dispose();
        if (results) {
          tf.dispose(results);
        }
      } catch (error) {
        console.error('Error en detección:', error);
      }
      
      animationRef.current = requestAnimationFrame(detectFrame);
    };
    
    // Cancelar animación previa
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animationRef.current = requestAnimationFrame(detectFrame);
  };

  // 4. Dibujar predicciones en el canvas
  const drawPredictions = (preds) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;
    
    if (!canvas || !ctx || !video) return;
    
    // Sincronizar tamaño del canvas con el video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar cada predicción
    preds.forEach(pred => {
      const [y, x, height, width] = pred.bbox;
      
      // Escalar coordenadas al tamaño del canvas
      const scaleX = canvas.width;
      const scaleY = canvas.height;
      
      const bbox = {
        x: x * scaleX,
        y: y * scaleY,
        width: width * scaleX,
        height: height * scaleY
      };
      
      // Dibujar rectángulo
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 2;
      ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);
      
      // Dibujar etiqueta
      ctx.fillStyle = '#00FF00';
      ctx.font = '16px Arial';
      const label = `${pred.class} (${(pred.score * 100).toFixed(1)}%)`;
      ctx.fillText(label, bbox.x, bbox.y > 10 ? bbox.y - 5 : 10);
    });
  };

  // 5. Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="computer-vision-container">
      <div className="header">
        <h1>🔬 Computer Vision con Autenticación</h1>
        <p>Conecta tu cámara (local o IP) y ejecuta modelos de visión por computadora</p>
      </div>
      
      <div className="main-content">
        <div className="camera-section">
          <SecureCamera 
            onStreamReady={handleStreamReady}
            onError={(error) => console.error('Error de cámara:', error)}
          />
        </div>
        
        <div className="vision-section">
          <div className="video-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ display: 'none' }}
            />
            
            <div className="canvas-wrapper">
              <canvas
                ref={canvasRef}
                className="detection-canvas"
              />
              
              {!stream && (
                <div className="overlay-message">
                  <p>👆 Conecta una cámara para comenzar la detección</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="predictions-panel">
            <h3>📊 Detecciones en Tiempo Real</h3>
            
            {isProcessing ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Cargando modelo...</p>
              </div>
            ) : predictions.length > 0 ? (
              <div className="predictions-list">
                {predictions.map((pred, index) => (
                  <div key={index} className="prediction-item">
                    <span className="prediction-class">{pred.class}</span>
                    <span className="prediction-score">
                      {`${(pred.score * 100).toFixed(1)}%`}
                    </span>
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill"
                        style={{ width: `${pred.score * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-predictions">
                <p>No se detectaron objetos aún</p>
                <small>Los objetos aparecerán aquí cuando sean detectados</small>
              </div>
            )}
            
            <div className="stats">
              <div className="stat-item">
                <span className="stat-label">Objetos detectados:</span>
                <span className="stat-value">{predictions.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Modelo:</span>
                <span className="stat-value">{modelType.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComputerVisionCamera;