import { RoomMetric, EventLog } from '../types/global.d'; // Importamos tipos

// --- Interfaz del Servicio ---
// Define claramente la forma y funciones que el servicio debe cumplir.
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
  ): void;

  pause(): void;
  resume(getAlertThreshold: () => number): void;
  subscribe(callback: (metrics: RoomMetric[]) => void): void;
  subscribeToEvents(callback: (events: EventLog[]) => void): void;
  unsubscribe(callback: (metrics: RoomMetric[]) => void): void;
  unsubscribeFromEvents(callback: (events: EventLog[]) => void): void;
  updateMetricsList(newMetrics: RoomMetric[]): void;
}

// --- Servicio Simulado de WebSocket ---
export const webSocketService: WebSocketService = {
  subscribers: [],
  eventSubscribers: [],
  metrics: [],
  events: [],
  intervalId: null,
  alertThreshold: 90, // Valor por defecto, se actualiza al iniciar/reanudar.

  /**
   * Inicializa la simulación de WebSocket y comienza la generación de métricas y eventos.
   */
  initialize(initialMetrics, initialEvents, getAlertThreshold) {
    this.metrics = [...initialMetrics];
    this.events = [...initialEvents];

    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      this.alertThreshold = getAlertThreshold();
      let eventTriggered = false;

      // Actualiza cada métrica con ocupación y estado aleatorios
      this.metrics = this.metrics.map(metric => {
        let newOccupied = metric.occupied + Math.floor(Math.random() * 3) - 1;
        newOccupied = Math.max(0, Math.min(metric.total, newOccupied));

        const newPercentage = metric.total > 0
          ? Math.round((newOccupied / metric.total) * 100)
          : 0;

        let newStatus = metric.status;
        const randomStatus = Math.random();

        // Simulación de cambios de estado aleatorios con generación de eventos
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

        // Verifica si se supera el umbral de ocupación
        if (newPercentage >= this.alertThreshold && metric.percentage < this.alertThreshold) {
          this.addEvent(
            'alert.highOccupancy',
            { room: metric.room, percentage: newPercentage.toString() },
            'alert'
          );
          eventTriggered = true;
        }

        return { ...metric, occupied: newOccupied, percentage: newPercentage, status: newStatus };
      });

      // Notifica a todos los suscriptores
      this.subscribers.forEach(cb => cb(this.metrics));

    }, 3000); // Actualiza cada 3 segundos
  },

  /**
   * Añade un evento al registro y notifica a los suscriptores.
   */
  addEvent(messageKey, messageArgs, level) {
    const newEvent: EventLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString(),
      messageKey,
      messageArgs,
      level,
    };

    this.events = [newEvent, ...this.events].slice(0, 100);
    this.eventSubscribers.forEach(cb => cb(this.events));
  },

  /** Pausa la simulación de WebSocket */
  pause() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
  },

  /** Reanuda la simulación de WebSocket */
  resume(getAlertThreshold) {
    if (!this.intervalId) this.initialize(this.metrics, this.events, getAlertThreshold);
  },

  /** Suscribe un callback a las métricas */
  subscribe(callback) { this.subscribers.push(callback); },

  /** Suscribe un callback a los eventos */
  subscribeToEvents(callback) { this.eventSubscribers.push(callback); },

  /** Desuscribe un callback de métricas */
  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter(cb => cb !== callback);
  },

  /** Desuscribe un callback de eventos */
  unsubscribeFromEvents(callback) {
    this.eventSubscribers = this.eventSubscribers.filter(cb => cb !== callback);
  },

  /** Actualiza la lista de métricas y sincroniza con los suscriptores */
  updateMetricsList(newMetrics) {
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
    this.subscribers.forEach(cb => cb(this.metrics));
  },
};
