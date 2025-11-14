"use client";

import { useEffect, useState } from "react";
import { Edit, Info, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useServices } from "@/hooks/use-services";
import { Service } from "@/types/services";
import ManageServicesForm from "./ManageServicesForm";

export function ManageServicesDialog() {
  const isDesktop = useMediaQuery("(min-width: 810px)");
  const [open, setOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { dataServicesAll, isLoading } = useServices();

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsEditing(true);
  };

  const handleView = (service: Service) => {
    setEditingService(service);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSuccess = () => {
    setIsEditing(false);
    setEditingService(null);
    setOpen(false);
  };

  // Auto-seleccionar el primer servicio cuando se cargan los datos
  useEffect(() => {
    if (dataServicesAll && dataServicesAll.length > 0 && !editingService) {
      setEditingService(dataServicesAll[0]);
      setIsEditing(false);
    }
  }, [dataServicesAll, editingService]);

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 size-4" aria-hidden="true" />
            Gestionar Servicios
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] p-0">
          <div className="flex flex-col h-full">
            {/* Header con paleta de colores consistente */}
            <div className="px-6 py-4 border-b bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-base font-semibold text-foreground">Gestión de Servicios</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground mt-1">
                    Administra y edita los servicios disponibles en el sistema
                  </DialogDescription>
                </div>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex flex-1 min-h-0">
              {/* Lista de servicios - Sidebar con colores consistentes */}
              <div className="w-1/3 border-r bg-muted/30 dark:bg-muted/20">
                <div className="p-4 border-b bg-card">
                  <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Servicios Disponibles
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                      <p className="text-sm text-muted-foreground">Cargando servicios...</p>
                    </div>
                  ) : dataServicesAll && dataServicesAll.length > 0 ? (
                    <div className="space-y-3">
                      {dataServicesAll.map((service: Service) => (
                        <div
                          key={service.id}
                          className={`group relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            editingService?.id === service.id
                              ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-lg shadow-primary/10"
                              : "border-border bg-card hover:border-primary/50 hover:shadow-md hover:shadow-primary/5"
                          }`}
                          onClick={() => handleView(service)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <h4 className="font-medium text-foreground text-sm truncate">{service.name}</h4>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-60 group-hover:opacity-100 transition-opacity duration-200 ml-2 p-2 hover:bg-primary/10 flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(service);
                              }}
                            >
                              <Edit className="h-4 w-4 text-primary" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Settings className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">No hay servicios disponibles</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Panel de detalles/edición - Colores consistentes */}
              <div className="flex-1 flex flex-col">
                {editingService ? (
                  <ManageServicesForm
                    service={editingService}
                    isEditing={isEditing}
                    onEdit={() => handleEdit(editingService)}
                    onCancel={handleCancel}
                    onSuccess={handleSuccess}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center max-w-md">
                      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <Info className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-base font-medium text-foreground mb-2">Selecciona un Servicio</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Haz clic en cualquier servicio de la lista para ver sus detalles o editarlo
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );

  // Versión móvil con Drawer
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 size-4" aria-hidden="true" />
          Gestionar Servicios
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-[60vh]">
        <DrawerHeader className="pb-2">
          <DrawerTitle>Gestión de Servicios</DrawerTitle>
          <DrawerDescription>Administra y edita los servicios disponibles en el sistema</DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-0">
            <div className="px-4 overflow-w-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                  <p className="text-sm text-muted-foreground">Cargando servicios...</p>
                </div>
              ) : dataServicesAll && dataServicesAll.length > 0 ? (
                <div className="space-y-3 py-2">
                  {dataServicesAll.map((service: Service) => (
                    <div
                      key={service.id}
                      className={`group relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        editingService?.id === service.id
                          ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-lg shadow-primary/10"
                          : "border-border bg-card hover:border-primary/50 hover:shadow-md hover:shadow-primary/5"
                      }`}
                      onClick={() => handleView(service)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <h4 className="font-medium text-foreground text-sm truncate">{service.name}</h4>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-60 group-hover:opacity-100 transition-opacity duration-200 ml-2 p-2 hover:bg-primary/10 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(service);
                          }}
                        >
                          <Edit className="h-4 w-4 text-primary" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Settings className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">No hay servicios disponibles</p>
                </div>
              )}

              {editingService && (
                <div className="border-t">
                  <ManageServicesForm
                    service={editingService}
                    isEditing={isEditing}
                    onEdit={() => handleEdit(editingService)}
                    onCancel={handleCancel}
                    onSuccess={handleSuccess}
                  />
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
