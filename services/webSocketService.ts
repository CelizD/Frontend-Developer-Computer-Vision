// services/webSocketService.ts

import { RoomMetric, EventLog } from '../types/global.d'; // Importamos tipos
// Se elimina la importación de playAlertSound para centralizar la lógica en AppContext

// 1. Definición de la Interfaz para el Servicio
interface WebSocketService {
  subscribers: ((metrics: RoomMetric[]) => void)[];
  eventSubscribers: ((events: EventLog[]) => void)[];
  metrics: RoomMetric[];
  events: EventLog[];
  intervalId: any;
  alertThreshold: number;

  initialize(
    initialMetrics: RoomMetric[],
    initialEvents: EventLog[],
    getAlertThreshold: () => number
  ): void;

  addEvent(
    messageKey: string,
    messageArgs: Record<string, string> | undefined,
    level: 'info' | 'warn' | 'alert'
  ): void; // Se elimina 'forceSound' de la firma

  pause(): void;
  resume(getAlertThreshold: () => number): void;
  subscribe(callback: (metrics: RoomMetric[]) => void): void;
  subscribeToEvents(callback: (events: EventLog[]) => void): void;
  unsubscribe(callback: (metrics: RoomMetric[]) => void): void;
  unsubscribeFromEvents(callback: (events: EventLog[]) => void): void;
  updateMetricsList(newMetrics: RoomMetric[]): void;
}


// --- Servicio de WebSocket (Simulado) ---

// 2. Aplicamos la interfaz al objeto exportado
export const webSocketService: WebSocketService = {
  subscribers: [] as ((metrics: RoomMetric[]) => void)[],
  eventSubscribers: [] as ((events: EventLog[]) => void)[],
  metrics: [] as RoomMetric[],
  events: [] as EventLog[],
  intervalId: null as any,
  alertThreshold: 90, // Valor por defecto, se actualiza al iniciar/reanudar.

  /**
   * Inicializa la simulación de WebSocket y comienza la generación de datos.
   * @param initialMetrics Métricas de aula iniciales (desde localStorage).
   * @param initialEvents Historial de eventos inicial (desde localStorage).
   * @param getAlertThreshold Función para obtener el umbral de alerta actual.
   */
  initialize(
    initialMetrics: RoomMetric[],
    initialEvents: EventLog[],
    getAlertThreshold: () => number
  ) {
    this.metrics = [...initialMetrics];
    this.events = [...initialEvents];
    
    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      this.alertThreshold = getAlertThreshold();
      let eventTriggered = false;

      this.metrics = this.metrics.map(metric => {
        let newOccupied = metric.occupied + Math.floor(Math.random() * 3) - 1;
        if (newOccupied < 0) newOccupied = 0;
        if (newOccupied > metric.total) newOccupied = metric.total;
        
        const newPercentage = metric.total > 0 ? Math.round((newOccupied / metric.total) * 100) : 0;

        let newStatus = metric.status;
        const randomStatus = Math.random();
        if (metric.status === 'Online' && randomStatus < 0.02) {
          newStatus = 'Offline';
          this.addEvent('alert.cameraOffline', { room: metric.room }, 'alert');
          eventTriggered = true;
        } else if (metric.status === 'Online' && randomStatus < 0.05) {
          newStatus = 'Luz Baja';
          this.addEvent('alert.lowLight', { room: metric.room }, 'warn');
          eventTriggered = true;
        } else if (metric.status !== 'Online' && randomStatus < 0.1) {
          newStatus = 'Online';
          this.addEvent('alert.cameraOnline', { room: metric.room }, 'info');
          eventTriggered = true;
        }

        if (newPercentage >= this.alertThreshold && metric.percentage < this.alertThreshold) {
          // CORRECCIÓN: Se eliminó el parámetro 'true' de forceSound y la lógica de sonido directo.
          this.addEvent('alert.highOccupancy', { room: metric.room, percentage: newPercentage.toString() }, 'alert'); 
          eventTriggered = true;
        }

        return { ...metric, occupied: newOccupied, percentage: newPercentage, status: newStatus };
      });

      this.subscribers.forEach(callback => callback(this.metrics));
      if (eventTriggered) {
        // La notificación de eventos ya está cubierta por `addEvent`
      }

    }, 3000); // Intervalo de actualización (3 segundos)
  },

  /**
   * Añade un evento al registro y notifica a los suscriptores.
   * @param messageKey Clave de i18n del mensaje.
   * @param messageArgs Argumentos para interpolación.
   * @param level Nivel del evento.
   */
  // CORRECCIÓN: Se eliminó el parámetro 'forceSound' de la firma.
  addEvent(messageKey: string, messageArgs: Record<string, string> | undefined, level: 'info' | 'warn' | 'alert') {
    const newEvent: EventLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString(),
      messageKey,
      messageArgs,
      level,
    };
    this.events = [newEvent, ...this.events].slice(0, 100);
    // Notificamos a los suscriptores del registro de eventos (para el Context)
    this.eventSubscribers.forEach(callback => callback(this.events));
    // Se eliminó: if (forceSound) playAlertSound(); para evitar la doble reproducción.
  },

  /** Pausa la simulación. */
  pause() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
  },
  
  /** Reanuda la simulación. */
  resume(getAlertThreshold: () => number) {
    if (!this.intervalId) {
      this.initialize(this.metrics, this.events, getAlertThreshold);
    }
  },

  /** Suscribe un componente a las métricas en vivo. */
  subscribe(callback: (metrics: RoomMetric[]) => void) { this.subscribers.push(callback); },
  /** Suscribe un componente a los eventos de log. */
  subscribeToEvents(callback: (events: EventLog[]) => void) { this.eventSubscribers.push(callback); },
  /** Desuscribe un componente de las métricas. */
  unsubscribe(callback: (metrics: RoomMetric[]) => void) { this.subscribers = this.subscribers.filter(cb => cb !== callback); },
  /** Desuscribe un componente de los eventos. */
  unsubscribeFromEvents(callback: (events: EventLog[]) => void) { this.eventSubscribers = this.eventSubscribers.filter(cb => cb !== callback); },

  /** Sincroniza la lista de aulas desde el estado de React (CRUD) con el servicio simulado. */
  updateMetricsList(newMetrics: RoomMetric[]) {
    const syncedMetrics = newMetrics.map(newMetric => {
      const existing = this.metrics.find(m => m.room === newMetric.room);
      return {
        ...newMetric,
        occupied: existing ? existing.occupied : newMetric.occupied,
        percentage: existing ? existing.percentage : newMetric.percentage,
        status: existing ? existing.status : newMetric.status,
      };
    });
    this.metrics = syncedMetrics;
    this.subscribers.forEach(callback => callback(this.metrics));
  },
};