"use client";

import { useState } from "react";
import Image from "next/image";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface RoomImageViewerProps {
  imageUrl: string | undefined;
  roomName?: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoomImageViewer({ imageUrl, roomName = "Habitación", open, onOpenChange }: RoomImageViewerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
        {/* Título oculto visualmente pero disponible para lectores de pantalla */}
        <DialogTitle className="sr-only">Imagen de {roomName}</DialogTitle>

        <div className="relative w-full h-[65vh]">
          {imageUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={roomName}
                fill
                className="object-cover"
                priority
                quality={95}
              />
              <div className="absolute bottom-0 left-0 right-0 h-[10%] dark:bg-black/40 backdrop-blur-md flex">
                <div className="w-full flex items-center p-2">
                  <h2 className="text-xl text-white font-mono tracking-tight capitalize">{roomName}</h2>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted">
              <p className="text-muted-foreground">No hay imagen disponible</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Primero, crea un componente para la celda de imagen
export const RoomImageCell = ({ row }: { row: any }) => {
  const imageUrl = row.original.RoomTypes?.ImageRoomType?.imageUrl;
  const roomName = row.original.RoomTypes?.name || "habitación";
  const [showImageDialog, setShowImageDialog] = useState(false);

  return (
    <div>
      <RoomImageViewer
        imageUrl={imageUrl}
        roomName={`${roomName} - Nº ${row.original.number}`}
        open={showImageDialog}
        onOpenChange={setShowImageDialog}
      />

      {imageUrl ? (
        <div
          className="relative h-14 w-14 overflow-hidden rounded-md border cursor-pointer"
          onClick={() => setShowImageDialog(true)}
        >
          <Image
            src={imageUrl}
            alt={`Imagen de ${roomName}`}
            fill
            className="object-cover hover:scale-110 transition-transform duration-200"
            sizes="(max-width: 768px) 100px, 100px"
            quality={100}
            priority={true}
            loading="eager"
          />
        </div>
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted">
          <span className="text-xs text-muted-foreground">Sin imagen</span>
        </div>
      )}
    </div>
  );
};
