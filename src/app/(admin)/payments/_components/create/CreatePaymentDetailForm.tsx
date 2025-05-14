import { CreditCard, Tag } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CreateExtraServiceItem, CreatePaymentDetailSchema } from "../../_schema/createPaymentDetailsSchema";
import { CategoryPayment } from "../../_types/payment";
import PaymentDetailInformation from "./PaymentDetailInformation";
import SelectServicesPaymentDetail from "./SelectServicesPaymentDetail";

interface CreatePaymentDetailFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreatePaymentDetailSchema>;
  onSubmit: (data: CreatePaymentDetailSchema) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  categories: CategoryPayment[];
  filteredItems: CategoryPayment[];
  selectedItems: number[];
  setSelectedItems: (value: number[]) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  fields: CreateExtraServiceItem[];
  append: (value: CreateExtraServiceItem) => void;
  remove: (index: number) => void;
  update: (index: number, value: CreateExtraServiceItem) => void;
}

export default function CreatePaymentDetailForm({
  children,
  form,
  onSubmit,
  activeTab,
  setActiveTab,
  categories,
  filteredItems,
  selectedItems,
  setSelectedItems,
  searchTerm,
  setSearchTerm,
  fields,
  append,
  remove,
  update,
}: CreatePaymentDetailFormProps) {
  const getCategoryById = (id: string) => {
    return categories.find((cat) => cat.id === id) || categories[0];
  };

  const isDesktop = useMediaQuery("(min-width: 950px)");

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">
                <Tag className="h-4 w-4 mr-2 shrink-0" />
                <span className="truncate text-ellipsis">Servicios Adicionales</span>
              </TabsTrigger>
              <TabsTrigger value="payment">
                <CreditCard className="h-4 w-4 mr-2 shrink-0" />
                <span className="truncate text-ellipsis">Detalles de Pago</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col px-0">
            <ScrollArea className={`${isDesktop ? "h-[72vh]" : "h-[60vh]"} px-0`}>
              <div className="px-6 pb-6">
                <SelectServicesPaymentDetail
                  categories={categories}
                  filteredItems={filteredItems}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  searchTerm={searchTerm}
                  form={form}
                  setSearchTerm={setSearchTerm}
                  getCategoryById={getCategoryById}
                  setActiveTab={setActiveTab}
                  fields={fields}
                  append={append}
                  remove={remove}
                  update={update}
                />

                <PaymentDetailInformation form={form} getCategoryById={getCategoryById} fields={fields}>
                  {children}
                </PaymentDetailInformation>
              </div>
            </ScrollArea>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
