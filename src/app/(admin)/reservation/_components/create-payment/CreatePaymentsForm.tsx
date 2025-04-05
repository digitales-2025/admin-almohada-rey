import { useFieldArray, UseFormReturn } from "react-hook-form";

import { CreatePaymentSchema, ExtraServiceItem } from "@/app/(admin)/payment/_schema/createPaymentsSchema";
import { Form } from "@/components/ui/form";
import { Service } from "@/types/services";
import { DetailedReservation } from "../../_schemas/reservation.schemas";
import StepConfirmationPayment from "./steps/StepConfirmationPayment";
import StepPaymentMethod from "./steps/StepPaymentMethod";
import StepRoomPayment from "./steps/StepRoomPayment";

interface CreatePaymentsFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreatePaymentSchema>;
  onSubmit: (data: CreatePaymentSchema) => void;
  step: number;
  reservation: DetailedReservation;
  nights: number;
  dataServicesAll: Service[] | undefined;
  watchExtraServices: ExtraServiceItem[];
  calculateTotalAmount: () => void;
}

export default function CreatePaymentsForm({
  children,
  form,
  onSubmit,
  step,
  reservation,
  nights,
  dataServicesAll,
  watchExtraServices,
  calculateTotalAmount,
}: CreatePaymentsFormProps) {
  // Set up field array for extra services
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "extraServices",
  });

  // Update extra service subtotal
  const updateExtraServiceSubtotal = (index: number) => {
    const services = form.getValues("extraServices");
    const service = services[index];
    const subtotal = service.quantity * service.unitPrice;

    const updatedServices = [...services];
    updatedServices[index] = { ...service, subtotal };

    form.setValue("extraServices", updatedServices);
    calculateTotalAmount();
  };

  // Add a new extra service
  const addExtraService = (serviceTemplate: Service) => {
    // Verificar si el servicio ya existe en los extraServices
    const existingServices = form.getValues("extraServices");
    const serviceExists = existingServices.some((service) => service.id === serviceTemplate?.id);

    // Si el servicio ya existe, no permitir agregarlo nuevamente
    if (serviceExists) {
      return;
    }

    const newService = {
      id: serviceTemplate ? serviceTemplate.id : "",
      name: serviceTemplate ? serviceTemplate.name : "",
      quantity: 1,
      unitPrice: serviceTemplate ? serviceTemplate.price : 0,
      subtotal: serviceTemplate ? serviceTemplate.price : 0,
    };
    append(newService);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-6 space-y-6">
        {step === 1 && (
          <StepRoomPayment
            form={form}
            fields={fields}
            reservation={reservation}
            nights={nights}
            watchExtraServices={watchExtraServices}
            addExtraService={addExtraService}
            remove={remove}
            updateExtraServiceSubtotal={updateExtraServiceSubtotal}
            dataServicesAll={dataServicesAll}
          />
        )}

        {step === 2 && <StepPaymentMethod form={form} />}

        {step === 3 && <StepConfirmationPayment form={form} reservation={reservation} />}

        {children}
      </form>
    </Form>
  );
}
