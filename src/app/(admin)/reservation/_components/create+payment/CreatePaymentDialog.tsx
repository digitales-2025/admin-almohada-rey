"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Banknote,
  Building,
  CalendarIcon,
  CalendarPlus2Icon as CalendarIcon2,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  CreditCard,
  CreditCardIcon,
  DollarSign,
  Hotel,
  PlusCircle,
  Receipt,
  ShoppingCart,
  Smartphone,
  Trash2,
  Tv,
  Utensils,
  Wifi,
  Wine,
} from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { paymentSchema } from "@/app/(admin)/payment/_schema/createPaymentsSchema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Sample extra services for quick selection
const EXTRA_SERVICES = [
  { id: "breakfast", name: "Breakfast", icon: <Utensils className="h-4 w-4" />, price: 15 },
  { id: "wifi-premium", name: "Premium WiFi", icon: <Wifi className="h-4 w-4" />, price: 10 },
  { id: "minibar", name: "Minibar", icon: <Wine className="h-4 w-4" />, price: 25 },
  { id: "parking", name: "Parking", icon: <Car className="h-4 w-4" />, price: 20 },
  { id: "tv-premium", name: "Premium TV", icon: <Tv className="h-4 w-4" />, price: 12 },
];

interface CreatePaymentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreatePaymentDialog({ open, setOpen }: CreatePaymentDialogProps) {
  const [step, setStep] = useState(1);
  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentDate: new Date().toISOString(),
      description: "",
      roomId: "",
      days: 1,
      roomUnitPrice: 0,
      roomSubtotal: 0,
      extraServices: [],
      method: "CREDIT_CARD",
      totalAmount: 0,
    },
  });

  // Set up field array for extra services
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "extraServices",
  });

  // Watch values for calculations
  const watchRoomUnitPrice = form.watch("roomUnitPrice");
  const watchDays = form.watch("days");
  const watchExtraServices = form.watch("extraServices");

  // Calculate room subtotal
  const calculateRoomSubtotal = () => {
    const subtotal = watchRoomUnitPrice * watchDays;
    form.setValue("roomSubtotal", subtotal);
    calculateTotalAmount();
  };

  // Calculate total amount (room + extras)
  const calculateTotalAmount = () => {
    const roomSubtotal = form.getValues("roomSubtotal");
    const extrasTotal = watchExtraServices.reduce((sum, service) => sum + service.subtotal, 0);
    form.setValue("totalAmount", roomSubtotal + extrasTotal);
  };

  // Update calculations when values change
  useEffect(() => {
    calculateRoomSubtotal();
  }, [watchRoomUnitPrice, watchDays]);

  useEffect(() => {
    calculateTotalAmount();
  }, [watchExtraServices, form.getValues("roomSubtotal")]);

  // Add a new extra service
  const addExtraService = (serviceTemplate = null) => {
    const newService = {
      id: "1234",
      name: serviceTemplate ? serviceTemplate.name : "",
      quantity: 1,
      unitPrice: serviceTemplate ? serviceTemplate.price : 0,
      subtotal: serviceTemplate ? serviceTemplate.price : 0,
    };
    append(newService);
  };

  // Update extra service subtotal
  const updateExtraServiceSubtotal = (index) => {
    const services = form.getValues("extraServices");
    const service = services[index];
    const subtotal = service.quantity * service.unitPrice;

    const updatedServices = [...services];
    updatedServices[index] = { ...service, subtotal };

    form.setValue("extraServices", updatedServices);
    calculateTotalAmount();
  };

  function onSubmit(values) {
    console.log(values);
    setOpen(false);
    // Reset form and step
    form.reset();
    setStep(1);
  }

  const nextStep = () => {
    if (step === 1) {
      const isValid = form.trigger(["paymentDate", "description", "roomId", "days", "roomUnitPrice"]);
      if (isValid) setStep(2);
    } else if (step === 2) {
      const isValid = form.trigger(["method"]);
      if (isValid) setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case "CASH":
        return <Banknote className="h-6 w-6" />;
      case "CREDIT_CARD":
      case "DEBIT_CARD":
        return <CreditCard className="h-6 w-6" />;
      case "TRANSFER":
        return <Building className="h-6 w-6" />;
      case "YAPE":
      case "PLIN":
      case "PAYPAL":
      case "IZI_PAY":
        return <Smartphone className="h-6 w-6" />;
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case "CASH":
        return "from-green-500 to-emerald-600";
      case "CREDIT_CARD":
        return "from-blue-500 to-indigo-600";
      case "DEBIT_CARD":
        return "from-cyan-500 to-blue-600";
      case "TRANSFER":
        return "from-violet-500 to-purple-600";
      case "YAPE":
        return "from-purple-500 to-fuchsia-600";
      case "PLIN":
        return "from-fuchsia-500 to-pink-600";
      case "PAYPAL":
        return "from-blue-500 to-blue-700";
      case "IZI_PAY":
        return "from-orange-500 to-amber-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden rounded-xl">
        <div className="flex h-full">
          {/* Left sidebar with steps */}
          <div className="w-[200px] bg-primary/5 p-6 flex flex-col border-r">
            <div className="text-xl font-bold text-primary mb-6">Pago</div>

            <div className="space-y-6 flex-1">
              <div
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${step === 1 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-primary/5"}`}
                onClick={() => step > 1 && setStep(1)}
                style={{ cursor: step > 1 ? "pointer" : "default" }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  <Hotel className="h-4 w-4 shrink-0" />
                </div>
                <span>Habitación</span>
              </div>

              <div
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${step === 2 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-primary/5"}`}
                onClick={() => step > 2 && setStep(2)}
                style={{ cursor: step > 2 ? "pointer" : "default" }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  <CreditCardIcon className="h-4 w-4 shrink-0" />
                </div>
                <span>Método de Pago</span>
              </div>

              <div
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${step === 3 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-primary/5"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  <Receipt className="h-4 w-4" />
                </div>
                <span>Confirmación</span>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="text-xs text-muted-foreground">Step {step} of 3</div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 max-h-[80vh] overflow-y-auto">
            <DialogHeader className="px-6 pt-6 pb-0">
              <div className="flex items-center space-x-2">
                {step === 1 && <Hotel className="h-5 w-5 text-primary" />}
                {step === 2 && <CreditCardIcon className="h-5 w-5 text-primary" />}
                {step === 3 && <Receipt className="h-5 w-5 text-primary" />}
                <DialogTitle className="text-2xl font-bold">
                  {step === 1 && "Habitación y Servicios Extra"}
                  {step === 2 && "Método de Pago"}
                  {step === 3 && "Confirmación"}
                </DialogTitle>
              </div>
              <DialogDescription className="pt-2">
                {step === 1 && "Ingrese los detalles de la habitación y agregue servicios adicionales"}
                {step === 2 && "Seleccione cómo realizará el pago el huésped"}
                {step === 3 && "Revise la información del pago antes de confirmar"}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-6 space-y-6">
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="paymentDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-sm font-medium mb-1.5">Payment Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "pl-3 text-left font-normal border-2 h-11 rounded-lg",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) => field.onChange(date?.toISOString())}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium mb-1.5">Description</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter payment description"
                                {...field}
                                className="border-2 h-11 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Room Details Section */}
                    <Card className="border-2">
                      <CardHeader className="bg-primary/5 pb-3">
                        <div className="flex items-center space-x-2">
                          <Hotel className="h-5 w-5 text-primary" />
                          <CardTitle className="text-base">Room Details</CardTitle>
                        </div>
                        <CardDescription>Room reservation details and pricing</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="roomId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium mb-1.5">Room ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter room ID" {...field} className="border-2 h-11 rounded-lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="days"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium mb-1.5">Number of Days</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={1}
                                    placeholder="Enter number of days"
                                    {...field}
                                    className="border-2 h-11 rounded-lg"
                                    onChange={(e) => {
                                      field.onChange(Number(e.target.value));
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="roomUnitPrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium mb-1.5">Room Price (per night)</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Input
                                      type="number"
                                      min={0}
                                      step={0.01}
                                      placeholder="0.00"
                                      {...field}
                                      className="pl-9 border-2 h-11 rounded-lg"
                                      onChange={(e) => {
                                        field.onChange(Number(e.target.value));
                                      }}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="roomSubtotal"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium mb-1.5">Room Subtotal</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Input
                                      type="text"
                                      readOnly
                                      className="pl-9 bg-muted/50 border-2 h-11 rounded-lg font-medium"
                                      value={field.value.toFixed(2)}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Extra Services Section */}
                    <Card className="border-2">
                      <CardHeader className="bg-primary/5 pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Coffee className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base">Extra Services</CardTitle>
                          </div>
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            Optional
                          </Badge>
                        </div>
                        <CardDescription>Add additional services to this payment</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-5 space-y-4">
                        {/* Quick add services */}
                        <div>
                          <div className="text-sm font-medium mb-2">Quick Add Services</div>
                          <div className="flex flex-wrap gap-2">
                            {EXTRA_SERVICES.map((service) => (
                              <Button
                                key={service.id}
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-9 gap-1.5"
                                onClick={() => addExtraService(service)}
                              >
                                {service.icon}
                                {service.name}
                                <span className="text-xs font-normal text-muted-foreground ml-1">
                                  (${service.price})
                                </span>
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Extra services list */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-sm font-medium">Added Services</div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1"
                              onClick={() => addExtraService()}
                            >
                              <PlusCircle className="h-3.5 w-3.5" />
                              Custom Service
                            </Button>
                          </div>

                          {fields.length === 0 ? (
                            <div className="text-center py-6 border-2 border-dashed rounded-lg bg-muted/30">
                              <ShoppingCart className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">No extra services added yet</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Click "Quick Add" or "Custom Service" to add
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                              {fields.map((field, index) => (
                                <div key={field.id} className="border-2 rounded-lg overflow-hidden bg-white">
                                  <div className="bg-muted/20 px-4 py-2 border-b flex items-center justify-between">
                                    <FormField
                                      control={form.control}
                                      name={`extraServices.${index}.name`}
                                      render={({ field }) => (
                                        <FormItem className="flex-1 mb-0">
                                          <FormControl>
                                            <Input
                                              {...field}
                                              placeholder="Service name"
                                              className="h-9 text-base font-medium border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                                            />
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                                      onClick={() => remove(index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  <div className="p-4 grid grid-cols-3 gap-5">
                                    <FormField
                                      control={form.control}
                                      name={`extraServices.${index}.quantity`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-sm font-medium">Quantity</FormLabel>
                                          <FormControl>
                                            <Input
                                              type="number"
                                              min={1}
                                              {...field}
                                              className="h-10 text-base"
                                              onChange={(e) => {
                                                field.onChange(Number(e.target.value));
                                                setTimeout(() => updateExtraServiceSubtotal(index), 0);
                                              }}
                                            />
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={form.control}
                                      name={`extraServices.${index}.unitPrice`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-sm font-medium">Unit Price</FormLabel>
                                          <FormControl>
                                            <div className="relative">
                                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                              </div>
                                              <Input
                                                type="number"
                                                min={0}
                                                step={0.01}
                                                {...field}
                                                className="pl-9 h-10 text-base"
                                                onChange={(e) => {
                                                  field.onChange(Number(e.target.value));
                                                  setTimeout(() => updateExtraServiceSubtotal(index), 0);
                                                }}
                                              />
                                            </div>
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={form.control}
                                      name={`extraServices.${index}.subtotal`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-sm font-medium">Subtotal</FormLabel>
                                          <FormControl>
                                            <div className="relative">
                                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                              </div>
                                              <Input
                                                readOnly
                                                className="pl-9 h-10 bg-muted/30 text-base font-medium"
                                                value={field.value.toFixed(2)}
                                              />
                                            </div>
                                          </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      {fields.length > 0 && (
                        <CardFooter className="bg-muted/20 border-t flex justify-between py-3">
                          <div className="text-sm font-medium">Extra Services Total:</div>
                          <div className="font-bold text-primary">
                            ${watchExtraServices.reduce((sum, service) => sum + service.subtotal, 0).toFixed(2)}
                          </div>
                        </CardFooter>
                      )}
                    </Card>

                    {/* Total Amount */}
                    <div className="bg-primary/5 border-2 rounded-lg p-4 flex justify-between items-center">
                      <div className="text-base font-semibold">Total Amount:</div>
                      <div className="text-xl font-bold text-primary">${form.getValues("totalAmount").toFixed(2)}</div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium mb-4 block">Select Payment Method</FormLabel>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          {[
                            { value: "CASH", label: "Cash", description: "Physical currency" },
                            { value: "CREDIT_CARD", label: "Credit Card", description: "Visa, Mastercard, Amex" },
                            { value: "DEBIT_CARD", label: "Debit Card", description: "Direct from bank account" },
                            { value: "TRANSFER", label: "Bank Transfer", description: "Electronic wire transfer" },
                            { value: "YAPE", label: "Yape", description: "Mobile payment app" },
                            { value: "PLIN", label: 'Plin  description: "Mobile payment app' },
                            { value: "PLIN", label: "Plin", description: "Digital wallet" },
                            { value: "PAYPAL", label: "PayPal", description: "Online payment system" },
                            { value: "IZI_PAY", label: "Izi Pay", description: "Digital payment solution" },
                          ].map((method) => (
                            <div
                              key={method.value}
                              className={cn(
                                "relative overflow-hidden rounded-xl border-2 transition-all cursor-pointer hover:shadow-md",
                                field.value === method.value
                                  ? "border-primary ring-2 ring-primary/20"
                                  : "border-muted hover:border-primary/50"
                              )}
                              onClick={() => field.onChange(method.value)}
                            >
                              {/* Gradient background for selected method */}
                              {field.value === method.value && (
                                <div
                                  className={`absolute inset-0 bg-gradient-to-br ${getMethodColor(method.value)} opacity-10`}
                                ></div>
                              )}

                              <div className="relative p-4">
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={cn(
                                      "p-2.5 rounded-full",
                                      field.value === method.value
                                        ? `bg-gradient-to-br ${getMethodColor(method.value)} text-white`
                                        : "bg-muted"
                                    )}
                                  >
                                    {getMethodIcon(method.value)}
                                  </div>

                                  <div className="flex-1">
                                    <p className="font-medium">{method.label}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{method.description}</p>
                                  </div>

                                  {field.value === method.value && (
                                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                      <Check className="h-3 w-3 text-white" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="bg-muted/30 border rounded-xl overflow-hidden">
                      <div className="bg-primary/10 p-4 border-b">
                        <h3 className="text-lg font-medium flex items-center">
                          <Receipt className="h-5 w-5 mr-2 text-primary" />
                          Payment Summary
                        </h3>
                      </div>

                      <div className="p-5 space-y-5">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Date</div>
                            <div className="font-medium flex items-center">
                              <CalendarIcon2 className="h-4 w-4 mr-1.5 text-primary" />
                              {format(new Date(form.getValues("paymentDate")), "PPP")}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Description</div>
                            <div className="font-medium">{form.getValues("description") || "—"}</div>
                          </div>
                        </div>

                        <Separator />

                        {/* Room details */}
                        <div>
                          <div className="flex items-center mb-3">
                            <Hotel className="h-4 w-4 mr-1.5 text-primary" />
                            <h4 className="font-medium">Room Details</h4>
                          </div>

                          <div className="bg-muted/20 rounded-lg p-3 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Room ID:</span>
                              <span className="font-medium">{form.getValues("roomId")}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Days:</span>
                              <span className="font-medium">{form.getValues("days")}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Price per night:</span>
                              <span className="font-medium">${form.getValues("roomUnitPrice").toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between pt-1 border-t">
                              <span className="text-sm font-medium">Room Subtotal:</span>
                              <span className="font-bold">${form.getValues("roomSubtotal").toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Extra services */}
                        {form.getValues("extraServices").length > 0 && (
                          <div>
                            <div className="flex items-center mb-3">
                              <Coffee className="h-4 w-4 mr-1.5 text-primary" />
                              <h4 className="font-medium">Extra Services</h4>
                            </div>

                            <div className="bg-muted/20 rounded-lg p-3 space-y-3">
                              {form.getValues("extraServices").map((service) => (
                                <div
                                  key={service.id}
                                  className="flex justify-between items-center pb-2 border-b last:border-0 last:pb-0"
                                >
                                  <div>
                                    <div className="font-medium">{service.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {service.quantity} x ${service.unitPrice.toFixed(2)}
                                    </div>
                                  </div>
                                  <div className="font-medium">${service.subtotal.toFixed(2)}</div>
                                </div>
                              ))}

                              <div className="flex justify-between pt-1 border-t">
                                <span className="text-sm font-medium">Services Subtotal:</span>
                                <span className="font-bold">
                                  $
                                  {form
                                    .getValues("extraServices")
                                    .reduce((sum, service) => sum + service.subtotal, 0)
                                    .toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Payment method */}
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">Payment Method</div>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`p-1.5 rounded-full bg-gradient-to-br ${getMethodColor(form.getValues("method"))} text-white`}
                            >
                              {getMethodIcon(form.getValues("method"))}
                            </div>
                            <span className="font-medium">
                              {form
                                .getValues("method")
                                .replace("_", " ")
                                .replace(/([A-Z])/g, " $1")
                                .trim()}
                            </span>
                          </div>
                        </div>

                        <Separator />

                        {/* Total amount */}
                        <div className="flex justify-between items-center bg-primary/5 p-4 rounded-lg">
                          <span className="font-semibold text-lg">Total Amount</span>
                          <span className="font-bold text-xl text-primary">
                            ${form.getValues("totalAmount").toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                      <div className="text-amber-500 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-amber-800 font-medium">
                          Por favor verifique todos los detalles antes de confirmar
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          Esta acción creará un nuevo registro de pago en el sistema.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter className="flex justify-between pt-4 border-t mt-6">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={prevStep} className="gap-1">
                      <ChevronLeft className="h-4 w-4" /> Back
                    </Button>
                  ) : (
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                  )}

                  {step < 3 ? (
                    <Button type="button" onClick={nextStep} className="gap-1">
                      Continue <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                    >
                      Create Payment
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
