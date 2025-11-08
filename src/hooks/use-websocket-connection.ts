import { useEffect, useState } from "react";

import { socketService } from "@/services/socketService";

export type WebSocketConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

export function useWebSocketConnection() {
  const [status, setStatus] = useState<WebSocketConnectionStatus>("connecting");
  const [lastConnected, setLastConnected] = useState<Date | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    // Log inicial para diagnosticar diferencias entre entornos
    console.log("🚀 [WEBSOCKET HOOK] Inicializando conexión WebSocket", {
      env: process.env.NODE_ENV,
      socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "SSR",
      protocol: typeof window !== "undefined" ? window.location.protocol : "unknown",
      hostname: typeof window !== "undefined" ? window.location.hostname : "unknown",
    });

    // Conectar al WebSocket
    const socket = socketService.connect();

    // Función para actualizar el estado
    const updateStatus = (newStatus: WebSocketConnectionStatus) => {
      console.log("🔄 [WEBSOCKET HOOK] Estado:", status, "→", newStatus, "- SocketID:", socket.id);
      // Log adicional cuando hay error para diagnosticar
      if (newStatus === "error") {
        console.log("🔍 [DIAG] Estado cambió a ERROR - Info adicional:", {
          lastConnected,
          reconnectAttempts: reconnectAttempts + 1,
          socketConnected: socket.connected,
          transport: socket.io?.engine?.transport?.name,
          timestamp: new Date().toISOString(),
          env: process.env.NODE_ENV,
          socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL,
        });
      }
      setStatus(newStatus);
      if (newStatus === "connected") {
        setLastConnected(new Date());
        setReconnectAttempts(0);
      }
    };

    // Listeners de eventos del socket
    const handleConnect = () => {
      console.log("✅ [WEBSOCKET HOOK] Conectado - SocketID:", socket.id);
      updateStatus("connected");
    };

    const handleDisconnect = (reason: string) => {
      console.log("🔌 [WEBSOCKET HOOK] Desconectado - Razón:", reason, "- SocketID:", socket.id);

      // Log detallado para diagnosticar desconexiones
      console.log("🔍 [DIAG] Desconexión detallada:", {
        reason,
        socketId: socket.id,
        socketConnected: socket.connected,
        transport: socket.io?.engine?.transport?.name,
        engineState: socket.io?.engine?.readyState,
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL,
      });

      if (reason === "io client disconnect") {
        console.log("📴 [WEBSOCKET HOOK] Desconexión intencional");
        updateStatus("disconnected");
      } else if (reason === "io server disconnect") {
        console.log("🚨 [WEBSOCKET HOOK] Servidor desconectó al cliente");
        updateStatus("error");
      } else {
        console.log("⚠️ [WEBSOCKET HOOK] Desconexión no intencional, reconectando...");
        updateStatus("connecting");
        setReconnectAttempts((prev) => {
          const newAttempts = prev + 1;
          console.log("🔄 [WEBSOCKET HOOK] Intentos:", newAttempts);
          return newAttempts;
        });
      }
    };

    const handleConnectError = (error: Error) => {
      console.error("🚨 [WEBSOCKET HOOK] Error de conexión:", error.message);
      updateStatus("error");
      setReconnectAttempts((prev) => prev + 1);
    };

    const handleReconnect = () => {
      updateStatus("connecting");
    };

    const handleReconnectError = (error: Error) => {
      console.error("🚨 [WEBSOCKET HOOK] Error en reconexión:", error.message, "- Intentos:", reconnectAttempts);
      updateStatus("error");
    };

    const handleReconnectFailed = () => {
      console.error("🚨 [WEBSOCKET HOOK] Reconexión fallida - SocketID:", socket.id);
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
    console.log("🔍 [WEBSOCKET HOOK] Estado inicial - SocketID:", socket.id, "- Conectado:", socket.connected);
    if (socket.connected) {
      console.log("✅ [WEBSOCKET HOOK] Ya conectado");
      updateStatus("connected");
    } else {
      console.log("⏳ [WEBSOCKET HOOK] Conectando...");
      updateStatus("connecting");
    }

    // Escuchar eventos del servidor para manejo de estado
    socket.on("onPong", (data) => {
      console.warn("⚠️ [WEBSOCKET HOOK] Conexión inestable:", data?.message);
    });

    socket.on("onNoPing", (data) => {
      console.error("🚨 [WEBSOCKET HOOK] Conexión CANCELADA:", data?.message, "- Razón:", data?.reason);
      updateStatus("error");
      setReconnectAttempts((prev) => prev + 1);
    });

    // Cleanup
    return () => {
      console.log("🧹 [WEBSOCKET HOOK] Limpiando listeners - SocketID:", socket.id);
      if (timeout3s) clearTimeout(timeout3s);
      if (timeout5s) clearTimeout(timeout5s);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("onPong");
      socket.off("onNoPing");
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

  // Log del estado cuando cambia (solo informativo)
  useEffect(() => {
    console.log("📊 [WEBSOCKET HOOK] Estado:", status, "- Intentos:", reconnectAttempts);
  }, [status, reconnectAttempts]);

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
