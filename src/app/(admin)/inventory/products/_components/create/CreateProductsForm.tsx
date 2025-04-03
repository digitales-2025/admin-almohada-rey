import { Banknote, Box } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { InputWithIcon } from "@/components/input-with-icon";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateProductsSchema } from "../../_schema/createProductsSchema";
import { ProductType } from "../../_types/products";
import { ProductTypeLabels } from "../../_utils/products.utils";

interface CreateProductsFormProps extends Omit<React.ComponentPropsWithRef<"form">, "onSubmit"> {
  children: React.ReactNode;
  form: UseFormReturn<CreateProductsSchema>;
  onSubmit: (data: CreateProductsSchema) => void;
}

export default function CreateProductsForm({ children, form, onSubmit }: CreateProductsFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <InputWithIcon Icon={Box} placeholder="Ingrese el nombre del producto" {...field} />
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
                  min={0}
                  step={0.01}
                  placeholder="Ingrese el precio del producto"
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
