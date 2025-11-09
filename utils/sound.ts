/**
 * Reproduce un sonido de alerta simulado (un tono corto y agudo).
 * Utiliza la API Web Audio Context para generar el sonido de forma programática.
 */
export const playAlertSound = () => {
  // Evita ejecutar en entorno server-side o si no hay soporte de AudioContext
  if (typeof window === 'undefined' || !window.AudioContext) return;

  try {
    // Crear un nuevo contexto de audio
    // @ts-ignore
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Crear un oscilador para generar el tono
    const oscillator = audioContext.createOscillator();

    // Crear un nodo de ganancia para controlar el volumen
    const gainNode = audioContext.createGain();

    // Conectar el oscilador al nodo de ganancia
    oscillator.connect(gainNode);

    // Conectar el nodo de ganancia a la salida del audio (altavoces)
    gainNode.connect(audioContext.destination);

    // Inicializar el volumen en 0 para evitar pops
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);

    // Configurar la frecuencia del oscilador (tono)
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);

    // Subir rápidamente el volumen a 0.3 en 20ms (fade in)
    gainNode.gain.exponentialRampToValueAtTime(0.3, audioContext.currentTime + 0.02);

    // Disminuir rápidamente el volumen a casi 0 en 100ms (fade out)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

    // Iniciar el oscilador
    oscillator.start(audioContext.currentTime);

    // Detener el oscilador después de 100ms
    oscillator.stop(audioContext.currentTime + 0.1);

  } catch (e) {
    // Manejo de errores al reproducir el sonido
    console.error("Error al reproducir sonido de alerta:", e);
  }
};
