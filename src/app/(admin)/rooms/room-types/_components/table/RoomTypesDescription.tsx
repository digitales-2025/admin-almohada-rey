"use client";

import { useState } from "react";
import { Maximize } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RoomType } from "../../_types/roomTypes";

interface RoomTypeDescriptionProps {
  row: RoomType;
}

export const RoomTypeDescription = ({ row }: RoomTypeDescriptionProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <Card className="mx-auto w-full overflow-hidden py-4 px-6">
      <CardContent className="p-0">
        {/* Carrusel de imágenes */}
        {row.imagesRoomType && row.imagesRoomType.length > 0 ? (
          <div>
            <h3 className="font-semibold text-primary mb-3">Galería de imágenes</h3>
            <Carousel className="w-full" opts={{ loop: true }}>
              <CarouselContent>
                {row.imagesRoomType.map((image) => (
                  <CarouselItem key={image.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="p-1 relative group">
                      <img
                        src={image.url}
                        alt={`${row.name} - Imagen`}
                        className="w-full aspect-video object-cover rounded-lg cursor-pointer"
                        width={400}
                        height={300}
                        onClick={() => setSelectedImage(image.url)}
                      />
                      {image.isMain && <Badge className="absolute top-3 right-3 bg-primary/70">Principal</Badge>}
                      <div
                        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        onClick={() => setSelectedImage(image.url)}
                      >
                        <Maximize className="text-white h-8 w-8" />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No hay imágenes disponibles para este tipo de habitación.
          </p>
        )}
      </CardContent>

      {/* Modal para imagen ampliada */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Vista Ampliada - {row.name}</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <img
              src={selectedImage}
              alt={`${row.name} - Vista ampliada`}
              className="w-full object-contain max-h-[70vh] rounded-lg"
              width={400}
              height={300}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
