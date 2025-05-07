import { toast } from "sonner";

import { CreateExtraServiceItem } from "../_schema/createPaymentDetailsSchema";
import { CategoryItemPayment, CategoryPayment } from "../_types/payment";

// Add a service to the cart
export const addService = (
  service: CategoryItemPayment,
  category: CategoryPayment,
  watchExtraServices: CreateExtraServiceItem[],
  append: (value: CreateExtraServiceItem) => void,
  update: (index: number, value: CreateExtraServiceItem) => void
) => {
  // Check if service already exists in cart with the same price
  const existingIndex = watchExtraServices.findIndex(
    (item) => item.id === service.id && item.category === category.id && item.unitPrice === service.price
  );

  // Comprobar si es producto (categoría "products") y tiene límite de stock
  const isProduct = category.id === "products";
  const stockLimit = isProduct && service.quantity ? service.quantity : Infinity;

  // Verificar el stock disponible total teniendo en cuenta los ítems ya agregados
  if (isProduct) {
    const totalQuantityInCart = watchExtraServices
      .filter((item) => item.id === service.id && item.category === category.id)
      .reduce((sum, item) => sum + item.quantity, 0);

    if (totalQuantityInCart >= stockLimit) {
      toast.error("Stock limitado", {
        description: `No hay más unidades disponibles de ${service.name}`,
        duration: 3000,
      });
      return;
    }
  }

  if (existingIndex >= 0) {
    // Si existe un ítem con el mismo precio, incrementamos su cantidad
    const currentItem = watchExtraServices[existingIndex];
    const updatedService = {
      ...currentItem,
      quantity: currentItem.quantity + 1,
      subtotal: (currentItem.quantity + 1) * currentItem.unitPrice,
    };
    update(existingIndex, updatedService);
  } else {
    // Si no existe o tiene precio diferente, agregar como un nuevo ítem
    append({
      id: service.id,
      name: service.name,
      category: category.id,
      quantity: 1,
      unitPrice: service.price,
      subtotal: service.price,
    });
  }
};

// Update service quantity
export const updateServiceQuantity = (
  index: number,
  newQuantity: number,
  watchExtraServices: CreateExtraServiceItem[],
  update: (index: number, value: CreateExtraServiceItem) => void,
  categories?: CategoryPayment[] // Hacemos que categories sea opcional
) => {
  if (newQuantity < 1) return;

  const service = watchExtraServices[index];

  // Verificar límite de stock para productos
  if (service.category === "products" && categories && Array.isArray(categories)) {
    const category = categories.find((cat) => cat.id === service.category);
    if (category) {
      const productItem = category.items.find((item) => item.id === service.id);
      const stockLimit = productItem?.quantity || 0;

      // Calcular cuántas unidades del mismo producto hay en el carrito (excluyendo el ítem actual)
      const otherQuantityInCart = watchExtraServices
        .filter((item, idx) => item.id === service.id && item.category === service.category && idx !== index)
        .reduce((sum, item) => sum + item.quantity, 0);

      // Calcular el máximo que podemos agregar al ítem actual
      const maxAvailableForThisItem = stockLimit - otherQuantityInCart;

      // Si intentamos poner más que lo disponible
      if (newQuantity > maxAvailableForThisItem) {
        // Si no hay disponibilidad para este ítem
        if (maxAvailableForThisItem <= 0) {
          toast.error("Stock limitado", {
            description: `No se pueden agregar más unidades de ${service.name}`,
            duration: 3000,
          });
          return; // Mantener la cantidad actual
        }

        // Si hay alguna disponibilidad, pero menos de lo solicitado
        toast.error("Stock limitado", {
          description: `Solo puede agregar ${maxAvailableForThisItem} unidades más de ${service.name}`,
          duration: 3000,
        });

        // Actualizar al máximo disponible
        const updatedService = {
          ...service,
          quantity: maxAvailableForThisItem,
          subtotal: maxAvailableForThisItem * service.unitPrice,
        };
        update(index, updatedService);
        return;
      }
    }
  }

  // Si todo está bien, actualizar a la cantidad solicitada
  const updatedService = {
    ...service,
    quantity: newQuantity,
    subtotal: newQuantity * service.unitPrice,
  };
  update(index, updatedService);
};

export const updateServiceUnitPrice = (
  index: number,
  newUnitPrice: number,
  watchExtraServices: CreateExtraServiceItem[],
  update: (index: number, value: CreateExtraServiceItem) => void
) => {
  if (newUnitPrice < 0) return; // Un precio negativo no tiene sentido

  const service = watchExtraServices[index];
  const currentQuantity = service.quantity;

  const updatedService = {
    ...service,
    unitPrice: newUnitPrice,
    subtotal: currentQuantity * newUnitPrice,
  };

  update(index, updatedService);
};

export const toggleItemSelection = (
  index: number,
  selectedItems: number[],
  setSelectedItems: (value: number[]) => void
) => {
  if (selectedItems.includes(index)) {
    setSelectedItems(selectedItems.filter((i) => i !== index));
  } else {
    setSelectedItems([...selectedItems, index]);
  }
};

export const removeSelectedItems = (
  remove: (index: number) => void,
  selectedItems: number[],
  setSelectedItems: (value: number[]) => void
) => {
  // Sort in descending order to avoid index shifting issues
  const sortedIndices = [...selectedItems].sort((a, b) => b - a);
  sortedIndices.forEach((index) => {
    remove(index);
  });
  setSelectedItems([]);
};
