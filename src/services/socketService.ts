import { io, Socket } from "socket.io-client";

import { DetailedReservation } from "@/app/(admin)/reservation/_schemas/reservation.schemas";

// Definimos tipos para los eventos con la estructura correcta
type EventsMap = {
  newReservation: DetailedReservation;
  reservationUpdated: DetailedReservation;
  reservationDeleted: { id: string };
  availabilityChanged: { checkInDate: string; checkOutDate: string };
  roomAvailabilityChecked: {
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    isAvailable: boolean;
    timestamp: string;
  };
  reservationsInInterval: {
    checkInDate: string;
    checkOutDate: string;
    reservations: DetailedReservation[];
    timestamp: string;
  };
  getReservationsInInterval: { checkInDate: string; checkOutDate: string };
  checkoutAvailabilityChecked: {
    roomId: string;
    originalCheckoutDate: string;
    newCheckoutDate: string;
    isAvailable: boolean;
    timestamp: string;
  };
};

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Array<(data: unknown) => void>> = new Map();
  private reconnectTimer: NodeJS.Timeout | null = null;

  connect() {
    if (!this.socket) {
      // USAR LA URL de ENV (solo la URL base, sin namespace)
      const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
      // Construir la URL completa con el namespace
      const socketUrl = `${baseUrl}`;

      // Conectar al namespace específico usando io.of() o URL completa
      // Opciones de conexión optimizadas
      this.socket = io(socketUrl, {
        withCredentials: true,
        autoConnect: true,
        transports: ["websocket", "polling"], // Intentar websocket primero
        timeout: 20000, // Mayor timeout
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        path: "/socket.io", // Path de Socket.IO (debe coincidir con el servidor)
      });

      // Configurar listeners de heartbeat antes de conectar
      this.setupHeartbeatListeners();

      this.socket.on("connect", () => {
        console.log("✅ [SOCKET SERVICE] Conectado - SocketID:", this.socket?.id);
        // Limpiar timer de reconexión si existe
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }

        // Re-registrar todos los listeners existentes después de reconexión
        this.listeners.forEach((handlers, event) => {
          handlers.forEach((handler) => {
            this.socket?.on(event, handler);
          });
        });
      });

      this.socket.on("disconnect", (reason) => {
        console.log("🔌 [SOCKET SERVICE] Desconectado - Razón:", reason, "- SocketID:", this.socket?.id);
        // Si la desconexión no fue intencional, iniciar reconexión manual
        if (reason === "io server disconnect" || reason === "transport close") {
          console.log("🔄 [SOCKET SERVICE] Iniciando reconexión manual...");
          this.manualReconnect();
        }
      });

      this.socket.on("connect_error", (error) => {
        console.error("🚨 [SOCKET SERVICE] Error de conexión:", error.message, "- URL:", socketUrl);
        // Si falla, intentar con polling
        if (this.socket) {
          this.socket.io.opts.transports = ["polling", "websocket"];
        }
      });

      this.socket.io.on("reconnect_attempt", () => {
        console.log("🔄 [SOCKET SERVICE] Intentando reconectar...");
      });

      this.socket.io.on("reconnect_error", (error) => {
        console.error("❌ [SOCKET SERVICE] Error en reconexión:", error.message || error);
      });

      this.socket.io.on("reconnect_failed", () => {
        console.error("🚨 [SOCKET SERVICE] Reconexión fallida, iniciando reconexión manual");
        this.manualReconnect();
      });

      // Escuchar eventos importantes para diagnóstico (solo errores y eventos críticos)
      this.socket.onAny((eventName, ...args) => {
        if (
          eventName === "connect" ||
          eventName === "disconnect" ||
          eventName === "connect_error" ||
          eventName === "onPong" ||
          eventName === "onNoPing"
        ) {
          console.log("📨 [SOCKET SERVICE] Evento importante:", eventName, args.length > 0 ? args[0] : "");
        }
      });
    }
    return this.socket;
  }

  // Método para configurar listeners de heartbeat
  private setupHeartbeatListeners() {
    if (!this.socket) return;

    console.log("🔄 [SOCKET SERVICE] Configurando heartbeat para SocketID:", this.socket.id);

    // Escuchar ping del servidor y responder con pong
    this.socket.on("ping", () => {
      console.log("🏓 [SOCKET SERVICE] Ping recibido, enviando pong...");
      if (this.socket?.connected && this.socket.id) {
        this.socket.emit("pong", {
          clientId: this.socket.id,
          timestamp: Date.now(),
        });
        console.log("✅ [SOCKET SERVICE] Pong enviado");
      } else {
        console.warn("⚠️ [SOCKET SERVICE] No se puede enviar pong - socket desconectado");
      }
    });

    // Escuchar onPong (advertencia de conexión inestable)
    this.socket.on("onPong", (data) => {
      console.warn("⚠️ [SOCKET SERVICE] Conexión inestable:", data.message);
    });

    // Escuchar onNoPing (conexión cancelada por el servidor)
    this.socket.on("onNoPing", (data) => {
      console.error("🚨 [SOCKET SERVICE] Conexión CANCELADA por servidor:", data.message, "- Razón:", data.reason);
      // Desconectar el socket ya que el servidor lo canceló
      if (this.socket) {
        console.log("🔌 [SOCKET SERVICE] Desconectando socket por cancelación del servidor");
        this.socket.disconnect();
      }
    });
  }

  // Método para reconexión manual después de fallo
  private manualReconnect() {
    if (this.reconnectTimer) return;

    this.reconnectTimer = setTimeout(() => {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
      this.connect();
      this.reconnectTimer = null;
    }, 5000);
  }

  // Método genérico para escuchar eventos con tipo
  on<E extends keyof EventsMap>(event: E, handler: (data: EventsMap[E]) => void) {
    if (!this.socket) this.connect();

    // Guardar handler para reconexiones
    if (!this.listeners.has(event as string)) {
      this.listeners.set(event as string, []);
    }
    this.listeners.get(event as string)?.push(handler as (data: unknown) => void);

    this.socket?.on(event as string, handler as (data: unknown) => void);

    return () => this.off(event, handler);
  }

  // Método genérico para dejar de escuchar eventos con tipo
  off<E extends keyof EventsMap>(event: E, handler: (data: EventsMap[E]) => void) {
    this.socket?.off(event as string, handler as (data: unknown) => void);

    // Eliminar handler de la lista
    const handlers = this.listeners.get(event as string) || [];
    const index = handlers.indexOf(handler as (data: unknown) => void);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }

  // Método genérico para emitir eventos con tipo
  emit<E extends keyof EventsMap>(event: E, data?: EventsMap[E]) {
    if (!this.socket?.connected) {
      this.connect();

      // Esperar 500ms para dar tiempo a la conexión
      setTimeout(() => {
        this.socket?.emit(event as string, data);
      }, 500);
    } else {
      this.socket.emit(event as string, data);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  // Métodos específicos para eventos de reservaciones con tipos correctos
  onNewReservation(handler: (reservation: DetailedReservation) => void) {
    return this.on("newReservation", handler);
  }

  onReservationUpdated(handler: (reservation: DetailedReservation) => void) {
    return this.on("reservationUpdated", handler);
  }

  onReservationDeleted(handler: (data: { id: string }) => void) {
    return this.on("reservationDeleted", handler);
  }

  onAvailabilityChanged(handler: (data: { checkInDate: string; checkOutDate: string }) => void) {
    return this.on("availabilityChanged", handler);
  }

  // NUEVO: Método para escuchar verificación de disponibilidad
  onRoomAvailabilityChecked(
    handler: (data: {
      roomId: string;
      checkInDate: string;
      checkOutDate: string;
      isAvailable: boolean;
      timestamp: string;
    }) => void
  ) {
    return this.on("roomAvailabilityChecked", handler);
  }

  // NUEVO: Método mejorado para recibir reservaciones en intervalo
  onReservationsInInterval(
    handler: (data: {
      checkInDate: string;
      checkOutDate: string;
      reservations: DetailedReservation[];
      timestamp: string;
    }) => void
  ) {
    return this.on("reservationsInInterval", handler);
  }

  // Método para escuchar eventos de verificación de disponibilidad de checkout extendido
  onCheckoutAvailabilityChecked(
    handler: (data: {
      roomId: string;
      originalCheckoutDate: string;
      newCheckoutDate: string;
      isAvailable: boolean;
      timestamp: string;
    }) => void
  ) {
    return this.on("checkoutAvailabilityChecked", handler);
  }

  // Método para solicitar reservaciones en un intervalo
  requestReservationsInInterval(checkInDate: string, checkOutDate: string) {
    this.emit("getReservationsInInterval", {
      checkInDate,
      checkOutDate,
    });
  }

  // Verificar estado de conexión
  isConnected(): boolean {
    return !!this.socket?.connected;
  }
}

export const socketService = new SocketService();
