"use client";

import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { AlertCircle, RotateCcw, Wifi, WifiOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useWebSocketConnection } from "@/hooks/use-websocket-connection";

interface WebSocketConnectionIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export function WebSocketConnectionIndicator({
  showDetails = false,
  className = "",
}: WebSocketConnectionIndicatorProps) {
  const { lastConnected, reconnectAttempts, reconnect, isConnected, isConnecting, hasError } = useWebSocketConnection();

  const getStatusIcon = () => {
    if (isConnected) return <Wifi className="h-4 w-4 text-green-500" />;
    if (isConnecting) return <RotateCcw className="h-4 w-4 text-yellow-500 animate-spin" />;
    if (hasError) return <AlertCircle className="h-4 w-4 text-red-500" />;
    return <WifiOff className="h-4 w-4 text-gray-500" />;
  };

  const getStatusText = () => {
    if (isConnected) return "Conectado";
    if (isConnecting) return "Conectando...";
    if (hasError) return "Error de conexión";
    return "Desconectado";
  };

  const getStatusColor = () => {
    if (isConnected) return "text-green-600";
    if (isConnecting) return "text-yellow-600";
    if (hasError) return "text-red-600";
    return "text-gray-600";
  };

  if (showDetails) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="flex items-center space-x-1">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>{getStatusText()}</span>
        </div>

        {lastConnected && isConnected && (
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(lastConnected, { addSuffix: true, locale: es })}
          </span>
        )}

        {reconnectAttempts > 0 && <span className="text-xs text-yellow-600">({reconnectAttempts} intentos)</span>}

        {hasError && (
          <Button variant="outline" size="sm" onClick={reconnect} className="h-6 px-2 text-xs">
            Reconectar
          </Button>
        )}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={hasError ? reconnect : undefined}
            className={`h-8 w-8 p-0 ${className}`}
            disabled={!hasError}
          >
            {getStatusIcon()}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="text-center">
            <div className="font-medium">{getStatusText()}</div>
            {lastConnected && isConnected && (
              <div className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(lastConnected, { addSuffix: true, locale: es })}
              </div>
            )}
            {reconnectAttempts > 0 && (
              <div className="text-xs text-yellow-400 mt-1">{reconnectAttempts} intentos de reconexión</div>
            )}
            {hasError && <div className="text-xs text-red-400 mt-1">Haz clic para reconectar</div>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
