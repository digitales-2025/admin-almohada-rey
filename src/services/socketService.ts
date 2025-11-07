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
      const namespace = "/reservations";
      // Construir la URL completa con el namespace
      const socketUrl = `${baseUrl}${namespace}`;

      console.log("🔌 [SOCKET SERVICE] Creando conexión:", {
        baseUrl,
        namespace,
        socketUrl,
        envVar: process.env.NEXT_PUBLIC_SOCKET_URL,
        timestamp: new Date().toISOString(),
      });

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

      console.log("📡 [SOCKET SERVICE] Socket creado, estado inicial:", {
        socketId: this.socket.id || "sin ID",
        connected: this.socket.connected,
        disconnected: this.socket.disconnected,
        hasTransport: !!this.socket.io?.engine?.transport,
        transportName: this.socket.io?.engine?.transport?.name,
      });

      this.socket.on("connect", () => {
        console.log("✅ [SOCKET SERVICE] Evento 'connect' recibido:", {
          socketId: this.socket?.id,
          connected: this.socket?.connected,
          timestamp: new Date().toISOString(),
        });

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
        // Si la desconexión no fue intencional, iniciar reconexión manual
        if (reason === "io server disconnect" || reason === "transport close") {
          this.manualReconnect();
        }
      });

      this.socket.on("connect_error", (error) => {
        console.error("🚨 [SOCKET SERVICE] Error de conexión:", {
          error: error.message,
          socketUrl,
          timestamp: new Date().toISOString(),
        });
        // Si falla, intentar con polling
        if (this.socket) {
          this.socket.io.opts.transports = ["polling", "websocket"];
        }
      });

      this.socket.io.on("reconnect_attempt", () => {});

      this.socket.io.on("reconnect_error", () => {});

      this.socket.io.on("reconnect_failed", () => {
        this.manualReconnect();
      });
    }
    return this.socket;
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
