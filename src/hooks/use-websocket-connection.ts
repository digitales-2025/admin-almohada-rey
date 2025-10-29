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
      setStatus(newStatus);
      if (newStatus === "connected") {
        setLastConnected(new Date());
        setReconnectAttempts(0);
      }
    };

    // Listeners de eventos del socket
    const handleConnect = () => {
      updateStatus("connected");
    };

    const handleDisconnect = (reason: string) => {
      if (reason === "io client disconnect") {
        updateStatus("disconnected");
      } else {
        updateStatus("connecting");
        setReconnectAttempts((prev) => prev + 1);
      }
    };

    const handleConnectError = () => {
      updateStatus("error");
      setReconnectAttempts((prev) => prev + 1);
    };

    const handleReconnect = () => {
      updateStatus("connecting");
    };

    const handleReconnectError = () => {
      updateStatus("error");
    };

    const handleReconnectFailed = () => {
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
      updateStatus("connected");
    } else {
      updateStatus("connecting");
    }

    // Cleanup
    return () => {
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
    socketService.disconnect();
    setStatus("connecting");
    setReconnectAttempts(0);

    const newSocket = socketService.connect();

    // Re-registrar listeners en el nuevo socket
    newSocket.on("connect", () => {
      setStatus("connected");
      setLastConnected(new Date());
      setReconnectAttempts(0);
    });

    newSocket.on("disconnect", (reason: string) => {
      if (reason === "io client disconnect") {
        setStatus("disconnected");
      } else {
        setStatus("connecting");
        setReconnectAttempts((prev) => prev + 1);
      }
    });

    newSocket.on("connect_error", () => {
      setStatus("error");
      setReconnectAttempts((prev) => prev + 1);
    });
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
