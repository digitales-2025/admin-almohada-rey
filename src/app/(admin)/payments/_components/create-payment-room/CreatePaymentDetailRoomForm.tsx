import { UseFormReturn } from "react-hook-form";

import { CreateRoomPaymentDetailSchema } from "@/app/(admin)/payments/_schema/createPaymentsSchema";
import { Form } from "@/components/ui/form";
import { RoomPaymentDetails } from "../../_types/payment";
import StepConfirmationPaymentDetailRoom from "./steps/StepConfirmationPaymentDetailRoom";
import StepPaymentDetailRoomMethod from "./steps/StepPaymentDetailRoomMethod";
import StepRoomPaymentDetail from "./steps/StepRoomPaymentDetail";

interface CreatePaymentDetailRoomFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateRoomPaymentDetailSchema>;
  onSubmit: (data: CreateRoomPaymentDetailSchema) => void;
  step: number;
  roomPaymentDetailsByPaymentId: RoomPaymentDetails | undefined;
  nights: number;
}

export default function CreatePaymentDetailRoomForm({
  children,
  form,
  onSubmit,
  step,
  roomPaymentDetailsByPaymentId,
  nights,
}: CreatePaymentDetailRoomFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-6 space-y-6">
        {step === 1 && (
          <StepRoomPaymentDetail
            form={form}
            roomPaymentDetailsByPaymentId={roomPaymentDetailsByPaymentId}
            nights={nights}
          />
        )}

        {step === 2 && <StepPaymentDetailRoomMethod form={form} />}

        {step === 3 && (
          <StepConfirmationPaymentDetailRoom
            form={form}
            roomPaymentDetailsByPaymentId={roomPaymentDetailsByPaymentId}
          />
        )}

        {children}
      </form>
    </Form>
  );
}
