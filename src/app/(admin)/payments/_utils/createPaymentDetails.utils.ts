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
  // Check if service already exists in cart
  const existingIndex = watchExtraServices.findIndex((item) => item.id === service.id && item.category === category.id);

  if (existingIndex >= 0) {
    // Update quantity if already exists
    const updatedService = {
      ...watchExtraServices[existingIndex],
      quantity: watchExtraServices[existingIndex].quantity + 1,
      subtotal: (watchExtraServices[existingIndex].quantity + 1) * service.price,
    };
    update(existingIndex, updatedService);
  } else {
    // Add new service
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
  update: (index: number, value: CreateExtraServiceItem) => void
) => {
  if (newQuantity < 1) return;

  const service = watchExtraServices[index];
  const updatedService = {
    ...service,
    quantity: newQuantity,
    subtotal: newQuantity * service.unitPrice,
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
