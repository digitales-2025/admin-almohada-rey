import { useEffect, useState } from "react";

import { socketService } from "@/services/socketService";

export type WebSocketConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

export function useWebSocketConnection() {
  const [status, setStatus] = useState<WebSocketConnectionStatus>("connecting");
  const [lastConnected, setLastConnected] = useState<Date | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    console.log("🚀 [WEBSOCKET HOOK] Inicializando hook, conectando al WebSocket...");

    // Conectar al WebSocket
    const socket = socketService.connect();

    console.log("📡 [WEBSOCKET HOOK] Socket inicial creado:", {
      socketId: socket.id || "sin ID aún",
      connected: socket.connected,
      disconnected: socket.disconnected,
    });

    // Función para actualizar el estado
    const updateStatus = (newStatus: WebSocketConnectionStatus) => {
      setStatus((prevStatus) => {
        console.log(`🔄 [WEBSOCKET HOOK] Actualizando estado: ${prevStatus} → ${newStatus}`);
        return newStatus;
      });
      if (newStatus === "connected") {
        setLastConnected(new Date());
        setReconnectAttempts(0);
      }
    };

    // Listeners de eventos del socket
    const handleConnect = () => {
      console.log("✅ [WEBSOCKET HOOK] Evento 'connect' recibido:", {
        socketId: socket.id,
        connected: socket.connected,
        timestamp: new Date().toISOString(),
      });
      updateStatus("connected");
    };

    const handleDisconnect = (reason: string) => {
      console.log("❌ [WEBSOCKET HOOK] Evento 'disconnect' recibido:", {
        reason,
        socketId: socket.id,
        wasConnected: socket.connected,
        timestamp: new Date().toISOString(),
      });
      if (reason === "io client disconnect") {
        updateStatus("disconnected");
      } else {
        updateStatus("connecting");
        setReconnectAttempts((prev) => {
          const newAttempts = prev + 1;
          console.log(`⚠️ [WEBSOCKET HOOK] Intento de reconexión automática #${newAttempts}`);
          return newAttempts;
        });
      }
    };

    const handleConnectError = (error: Error) => {
      console.error("🚨 [WEBSOCKET HOOK] Evento 'connect_error' recibido:", {
        errorMessage: error.message,
        errorStack: error.stack,
        socketId: socket.id,
        connected: socket.connected,
        ioTransport: socket.io?.engine?.transport?.name,
        timestamp: new Date().toISOString(),
      });
      updateStatus("error");
      setReconnectAttempts((prev) => prev + 1);
    };

    const handleReconnect = (attemptNumber: number) => {
      console.log(`🔄 [WEBSOCKET HOOK] Evento 'reconnect_attempt' recibido:`, {
        attemptNumber,
        socketId: socket.id,
        timestamp: new Date().toISOString(),
      });
      updateStatus("connecting");
    };

    const handleReconnectError = (error: Error) => {
      console.error("🚨 [WEBSOCKET HOOK] Evento 'reconnect_error' recibido:", {
        errorMessage: error.message,
        errorStack: error.stack,
        socketId: socket.id,
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

    // Verificar estado inicial
    if (socket.connected) {
      console.log("✅ [WEBSOCKET HOOK] Socket ya estaba conectado al inicializar");
      updateStatus("connected");
    } else {
      console.log("⏳ [WEBSOCKET HOOK] Socket no conectado aún, esperando conexión...");
      updateStatus("connecting");
    }

    // Cleanup
    return () => {
      console.log("🧹 [WEBSOCKET HOOK] Limpiando listeners del hook...");
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.io.off("reconnect_attempt", handleReconnect);
      socket.io.off("reconnect_error", handleReconnectError);
      socket.io.off("reconnect_failed", handleReconnectFailed);
    };
  }, []);

  // Función para reconectar manualmente
  const reconnect = () => {
    console.log("🔄 [WEBSOCKET RECONNECT] Iniciando reconexión manual");
    console.log("📊 [WEBSOCKET RECONNECT] Estado antes de desconectar:", {
      status,
      reconnectAttempts,
      lastConnected: lastConnected?.toISOString(),
      socketServiceConnected: socketService.isConnected(),
    });

    socketService.disconnect();

    console.log("🔌 [WEBSOCKET RECONNECT] Socket desconectado, esperando 100ms antes de reconectar...");

    // Pequeña pausa para asegurar que el disconnect se complete
    setTimeout(() => {
      console.log("🔗 [WEBSOCKET RECONNECT] Intentando crear nueva conexión...");
      setStatus("connecting");
      setReconnectAttempts(0);

      const newSocket = socketService.connect();

      console.log("📡 [WEBSOCKET RECONNECT] Nueva instancia de socket creada:", {
        socketId: newSocket.id || "sin ID aún",
        connected: newSocket.connected,
        disconnected: newSocket.disconnected,
      });

      // Re-registrar listeners en el nuevo socket
      const handleConnect = () => {
        console.log("✅ [WEBSOCKET RECONNECT] Conexión establecida exitosamente:", {
          socketId: newSocket.id,
          connected: newSocket.connected,
          timestamp: new Date().toISOString(),
        });
        setStatus("connected");
        setLastConnected(new Date());
        setReconnectAttempts(0);
      };

      const handleDisconnect = (reason: string) => {
        console.log("❌ [WEBSOCKET RECONNECT] Socket desconectado durante reconexión:", {
          reason,
          socketId: newSocket.id,
          wasConnected: newSocket.connected,
          timestamp: new Date().toISOString(),
        });
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
          console.log(`⚠️ [WEBSOCKET RECONNECT] Intento ${newAttempts} de reconexión falló`);
          return newAttempts;
        });
      };

      newSocket.on("connect", handleConnect);
      newSocket.on("disconnect", handleDisconnect);
      newSocket.on("connect_error", handleConnectError);

      // Verificar estado inmediato después de crear el socket
      setTimeout(() => {
        console.log("🔍 [WEBSOCKET RECONNECT] Estado después de 500ms:", {
          socketId: newSocket.id || "sin ID aún",
          connected: newSocket.connected,
          disconnected: newSocket.disconnected,
          hasActiveTransport: !!newSocket.io?.engine?.transport,
          transportName: newSocket.io?.engine?.transport?.name,
        });
      }, 500);
    }, 100);
  };

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
