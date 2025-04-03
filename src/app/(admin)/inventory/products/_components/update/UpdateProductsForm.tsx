import { Banknote, Box } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { InputWithIcon } from "@/components/input-with-icon";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";
import { CreateProductsSchema } from "../../_schema/createProductsSchema";
import { ProductType } from "../../_types/products";
import { ProductTypeLabels } from "../../_utils/products.utils";

interface UpdateCustomerFormProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateProductsSchema>;
  onSubmit: (data: CreateProductsSchema) => void;
}

export default function UpdateCustomersForm({ children, form, onSubmit }: UpdateCustomerFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <InputWithIcon
                  Icon={Box}
                  placeholder="Ingrese el nombre del producto"
                  className="capitalize"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unitCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <InputWithIcon
                  Icon={Banknote}
                  type="number"
                  placeholder="Ingrese el precio del producto"
                  min={0}
                  step={0.01}
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="type">Tipo de Producto</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un tipo de producto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(ProductType).map((productType) => {
                      const productTypeConfig = ProductTypeLabels[productType];
                      const Icon = productTypeConfig.icon;

                      return (
                        <SelectItem key={productType} value={productType} className="flex items-center gap-2">
                          <Icon className={`size-4 ${productTypeConfig.className}`} />
                          <span>{productTypeConfig.label}</span>
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  );
}
