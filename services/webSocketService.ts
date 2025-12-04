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

  fetchData(): Promise<void>;

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

// --- Servicio Modificado para Polling al Backend ---
export const webSocketService: WebSocketService = {
  subscribers: [],
  eventSubscribers: [],
  metrics: [],
  events: [],
  intervalId: null,
  alertThreshold: 90, // Valor por defecto, se actualiza al iniciar/reanudar.

  /**
   * Inicializa el polling (simulación de WebSocket) para obtener datos del backend.
   */
  initialize(initialMetrics, initialEvents, getAlertThreshold) {
    // Establecer estado inicial
    this.metrics = [...initialMetrics];
    this.events = [...initialEvents];
    this.alertThreshold = getAlertThreshold();

    // Ejecutar una carga inmediata
    this.fetchData();

    // Limpiar intervalo previo si existe
    if (this.intervalId) clearInterval(this.intervalId);

    // Configurar polling cada 3 segundos
    this.intervalId = setInterval(() => {
      // Actualizar el umbral en cada ciclo por si cambió en la configuración
      this.alertThreshold = getAlertThreshold();
      this.fetchData();
    }, 3000);
  },

  /**
   * Obtiene datos reales de la API de Django.
   */
  async fetchData() {
    try {
      // Petición directa sin token (API pública o sesión por cookie)
      const response = await fetch('http://127.0.0.1:8000/api/stats/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      
      const data = await response.json();

      // Transformamos la respuesta de Django al formato RoomMetric del frontend
      // Se asume que data.yolo_live_statistics viene de 'api/stats/'
      if (data && data.yolo_live_statistics) {
        const mappedMetrics: RoomMetric[] = data.yolo_live_statistics.map((cam: any) => {
            // Cálculos básicos basados en los datos reales
            const occupied = cam.live_person_count || 0;
            const total = 10; // Capacidad por defecto (ajustar según lógica de negocio)
            
            // Calcular porcentaje asegurando que no sea NaN
            const percentage = total > 0 ? Math.min(Math.round((occupied / total) * 100), 100) : 0;
            
            // Determinar estado basado en el backend
            let status: 'Online' | 'Offline' | 'Luz Baja' = 'Offline';
            if (cam.status === 'running' || cam.status === 'online') {
                status = 'Online';
            }

            // Lógica de alertas local basada en datos reales (opcional)
            if (percentage >= this.alertThreshold) {
                 // Aquí podrías disparar un evento si quisieras notificaciones frontend
                 // this.addEvent('alert.highOccupancy', { room: cam.camera_name }, 'alert');
            }

            return {
                id: cam.camera_name, // Usamos el nombre como ID
                room: cam.camera_name,
                total: total,
                occupied: occupied,
                percentage: percentage,
                status: status
            };
        });

        this.updateMetricsList(mappedMetrics);
      }

    } catch (error) {
      console.error("Error conectando con el backend:", error);
      // Opcional: Podrías cambiar el estado de las cámaras a 'Offline' aquí si falla la red
    }
  },

  /**
   * Añade un evento al registro y notifica a los suscriptores.
   * Útil para alertas generadas localmente o traídas del backend.
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

  /** Pausa el polling */
  pause() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
  },

  /** Reanuda el polling */
  resume(getAlertThreshold) {
    if (!this.intervalId) {
        // Reutilizamos initialize para arrancar de nuevo
        this.initialize(this.metrics, this.events, getAlertThreshold);
    }
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
    this.metrics = newMetrics;
    this.subscribers.forEach(cb => cb(this.metrics));
  },
};