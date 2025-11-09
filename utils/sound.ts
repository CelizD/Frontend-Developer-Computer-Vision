/**
 * Reproduce un sonido de alerta simulado (un tono corto y agudo).
 * Utiliza la API Web Audio Context para generar el sonido de forma programática.
 */
export const playAlertSound = () => {
  if (typeof window === 'undefined' || !window.AudioContext) return;
  try {
    // @ts-ignore
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.3, audioContext.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (e) {
    console.error("Error al reproducir sonido de alerta:", e);
  }
};