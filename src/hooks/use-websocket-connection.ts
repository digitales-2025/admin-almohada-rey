import { useEffect, useState } from "react";

import { socketService } from "@/services/socketService";

export type WebSocketConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

export function useWebSocketConnection() {
  const [status, setStatus] = useState<WebSocketConnectionStatus>("connecting");
  const [lastConnected, setLastConnected] = useState<Date | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    // Conectar al WebSocket
    const socket = socketService.connect();

    // Función para actualizar el estado
    const updateStatus = (newStatus: WebSocketConnectionStatus) => {
      console.log("🔄 [WEBSOCKET HOOK] Cambiando estado:", {
        from: status,
        to: newStatus,
        socketId: socket.id,
        socketConnected: socket.connected,
        timestamp: new Date().toISOString(),
      });
      setStatus(newStatus);
      if (newStatus === "connected") {
        setLastConnected(new Date());
        setReconnectAttempts(0);
      }
    };

    // Listeners de eventos del socket
    const handleConnect = () => {
      console.log("✅ [WEBSOCKET HOOK] handleConnect llamado:", {
        socketId: socket.id,
        socketConnected: socket.connected,
        currentStatus: status,
        timestamp: new Date().toISOString(),
      });
      updateStatus("connected");
    };

    const handleDisconnect = (reason: string) => {
      console.log("🔌 [WEBSOCKET HOOK] handleDisconnect llamado:", {
        reason,
        socketId: socket.id,
        socketConnected: socket.connected,
        currentStatus: status,
        timestamp: new Date().toISOString(),
      });
      if (reason === "io client disconnect") {
        console.log("📴 [WEBSOCKET HOOK] Desconexión intencional del cliente");
        updateStatus("disconnected");
      } else {
        console.log("⚠️ [WEBSOCKET HOOK] Desconexión no intencional, intentando reconectar...");
        updateStatus("connecting");
        setReconnectAttempts((prev) => {
          const newAttempts = prev + 1;
          console.log("🔄 [WEBSOCKET HOOK] Intentos de reconexión:", newAttempts);
          return newAttempts;
        });
      }
    };

    const handleConnectError = (error: Error) => {
      console.error("🚨 [WEBSOCKET HOOK] Error de conexión:", {
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      updateStatus("error");
      setReconnectAttempts((prev) => prev + 1);
    };

    const handleReconnect = () => {
      updateStatus("connecting");
    };

    const handleReconnectError = (error: Error) => {
      console.error("🚨 [WEBSOCKET HOOK] Error en reconexión:", {
        error: error.message,
        attempts: reconnectAttempts,
        timestamp: new Date().toISOString(),
      });
      updateStatus("error");
    };

    const handleReconnectFailed = () => {
      console.error("🚨 [WEBSOCKET HOOK] Evento 'reconnect_failed' recibido:", {
        socketId: socket.id,
        timestamp: new Date().toISOString(),
      });
      updateStatus("error");
    };

    // Registrar listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.io.on("reconnect_attempt", handleReconnect);
    socket.io.on("reconnect_error", handleReconnectError);
    socket.io.on("reconnect_failed", handleReconnectFailed);

    // Variables para timeouts de diagnóstico
    const timeout3s: NodeJS.Timeout | null = null;
    const timeout5s: NodeJS.Timeout | null = null;

    // Verificar estado inicial
    console.log("🔍 [WEBSOCKET HOOK] Verificando estado inicial:", {
      socketId: socket.id,
      socketConnected: socket.connected,
      currentStatus: status,
      timestamp: new Date().toISOString(),
    });
    if (socket.connected) {
      console.log("✅ [WEBSOCKET HOOK] Socket ya conectado, actualizando estado a 'connected'");
      updateStatus("connected");
    } else {
      console.log("⏳ [WEBSOCKET HOOK] Socket no conectado, actualizando estado a 'connecting'");
      updateStatus("connecting");
    }

    // Escuchar eventos personalizados del servidor (onPong, onNoPing)
    socket.on("onPong", (data: unknown) => {
      console.warn("⚠️ [WEBSOCKET HOOK] Evento 'onPong' recibido:", {
        data,
        socketId: socket.id,
        socketConnected: socket.connected,
        currentStatus: status,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("onNoPing", (data: unknown) => {
      console.error("🚨 [WEBSOCKET HOOK] Evento 'onNoPing' recibido:", {
        data,
        socketId: socket.id,
        socketConnected: socket.connected,
        currentStatus: status,
        timestamp: new Date().toISOString(),
      });
      // Cuando el servidor cancela la conexión, actualizar estado a error
      updateStatus("error");
      setReconnectAttempts((prev) => prev + 1);
    });

    // Escuchar evento ping del servidor
    socket.on("ping", () => {
      console.log("🏓 [WEBSOCKET HOOK] Ping recibido del servidor:", {
        socketId: socket.id,
        socketConnected: socket.connected,
        currentStatus: status,
        timestamp: new Date().toISOString(),
      });
    });

    // Cleanup
    return () => {
      console.log("🧹 [WEBSOCKET HOOK] Limpiando listeners:", {
        socketId: socket.id,
        timestamp: new Date().toISOString(),
      });
      if (timeout3s) clearTimeout(timeout3s);
      if (timeout5s) clearTimeout(timeout5s);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("onPong");
      socket.off("onNoPing");
      socket.off("ping");
      socket.io.off("reconnect_attempt", handleReconnect);
      socket.io.off("reconnect_error", handleReconnectError);
      socket.io.off("reconnect_failed", handleReconnectFailed);
    };
  }, []);

  // Función para reconectar manualmente
  const reconnect = () => {
    socketService.disconnect();

    // Pequeña pausa para asegurar que el disconnect se complete
    setTimeout(() => {
      setStatus("connecting");
      setReconnectAttempts(0);

      const newSocket = socketService.connect();

      // Re-registrar listeners en el nuevo socket
      const handleConnect = () => {
        setStatus("connected");
        setLastConnected(new Date());
        setReconnectAttempts(0);
      };

      const handleDisconnect = (reason: string) => {
        if (reason === "io client disconnect") {
          setStatus("disconnected");
        } else {
          setStatus("connecting");
          setReconnectAttempts((prev) => prev + 1);
        }
      };

      const handleConnectError = (error: Error) => {
        console.error("🚨 [WEBSOCKET RECONNECT] Error al conectar:", {
          error: error.message,
          errorStack: error.stack,
          socketId: newSocket.id,
          connected: newSocket.connected,
          ioTransport: newSocket.io?.engine?.transport?.name,
          timestamp: new Date().toISOString(),
        });
        setStatus("error");
        setReconnectAttempts((prev) => {
          const newAttempts = prev + 1;
          return newAttempts;
        });
      };

      newSocket.on("connect", handleConnect);
      newSocket.on("disconnect", handleDisconnect);
      newSocket.on("connect_error", handleConnectError);
    }, 100);
  };

  // Log del estado actual cuando cambia
  useEffect(() => {
    console.log("📊 [WEBSOCKET HOOK] Estado actualizado:", {
      status,
      isConnected: status === "connected",
      isConnecting: status === "connecting",
      isDisconnected: status === "disconnected",
      hasError: status === "error",
      lastConnected,
      reconnectAttempts,
      timestamp: new Date().toISOString(),
    });
  }, [status, lastConnected, reconnectAttempts]);

  return {
    status,
    lastConnected,
    reconnectAttempts,
    reconnect,
    isConnected: status === "connected",
    isConnecting: status === "connecting",
    isDisconnected: status === "disconnected",
    hasError: status === "error",
  };
}
