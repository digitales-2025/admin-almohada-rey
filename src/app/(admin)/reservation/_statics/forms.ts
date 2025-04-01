import { ComplexFormStatics } from "@/types/statics/forms";
import { CreateReservationInput, ReservationGuestDto } from "../_schemas/reservation.schemas";

// export const createReservationSchema = z.object({
//     customerId: z.string({
//         required_error: "El cliente es requerido"
//     }),
//     roomId: z.string({
//         required_error: "La habitación es requerida"
//     }),
//     userId: z.string({
//         required_error: "El usuario es requerido"
//     }),
//     reservationDate: z.string({
//         required_error: "La fecha de reserva es requerida"
//     }),
//     checkInDate: z.string({
//         required_error: "La fecha de check-in es requerida"
//     }),
//     checkOutDate: z.string({
//         required_error: "La fecha de check-out es requerida"
//     }),
//     status: z.enum(["PENDING", "CHECKED_IN", "CHECKED_OUT", "CANCELED"]),
//     guests: z.array(z.object({
//         name: z.string(),
//         age: z.number().optional(),
//         documentId: z.string().optional(),
//         documentType: z.enum(["DNI", "PASSPORT", "FOREIGNER_CARD"]).optional(),
//         phone: z.string().optional(),
//         email: z.string().optional(),
//         birthDate: z.string().optional(),
//         additionalInfo: z.string().optional()
//     })).optional(),
//     observations: z.string().optional()
// })
export const FORMSTATICS: ComplexFormStatics<CreateReservationInput, ReservationGuestDto> = {
  customerId: {
    required: true,
    label: "Cliente",
    type: "select",
    placeholder: "Selecciona un cliente",
    emptyMessage: "No se encontraron clientes",
    name: "customerId",
  },
  roomId: {
    required: true,
    label: "Habitación",
    type: "select",
    placeholder: "Selecciona una habitación",
    emptyMessage: "No se encontraron habitaciones",
    name: "roomId",
  },
  userId: {
    required: true,
    label: "Usuario",
    type: "select",
    placeholder: "Selecciona un usuario",
    emptyMessage: "No se encontraron usuarios",
    name: "userId",
  },
  reservationDate: {
    required: true,
    label: "Fecha de reserva",
    type: "date",
    placeholder: "Fecha de reserva",
    name: "reservationDate",
  },
  checkInDate: {
    required: true,
    label: "Fecha de check-in",
    type: "date",
    placeholder: "Fecha de check-in",
    name: "checkInDate",
  },
  checkOutDate: {
    required: true,
    label: "Fecha de check-out",
    type: "date",
    placeholder: "Fecha de check-out",
    name: "checkOutDate",
  },
  status: {
    required: true,
    label: "Estado",
    type: "select",
    placeholder: "Selecciona un estado",
    emptyMessage: "No se encontraron estados",
    name: "status",
  },
  guests: {
    required: false,
    label: "Acompañantes",
    type: "array",
    placeholder: "Acompañantes",
    name: "guests",
    subFields: {
      name: {
        required: true,
        label: "Nombre",
        type: "text",
        placeholder: "Nombre",
        name: "name",
      },
      age: {
        required: false,
        label: "Edad",
        type: "number",
        placeholder: "Edad",
        name: "age",
      },
      documentId: {
        required: false,
        label: "Documento",
        type: "text",
        placeholder: "Documento",
        name: "documentId",
      },
      documentType: {
        required: false,
        label: "Tipo de documento",
        type: "select",
        placeholder: "Selecciona un tipo de documento",
        emptyMessage: "No se encontraron tipos de documento",
        name: "documentType",
      },
      phone: {
        required: false,
        label: "Teléfono",
        type: "text",
        placeholder: "Teléfono",
        name: "phone",
      },
      email: {
        required: false,
        label: "Correo electrónico",
        type: "text",
        placeholder: "Correo electrónico",
        name: "email",
      },
      birthDate: {
        required: false,
        label: "Fecha de nacimiento",
        type: "date",
        placeholder: "Fecha de nacimiento",
        name: "birthDate",
      },
      additionalInfo: {
        required: false,
        label: "Información adicional",
        type: "text",
        placeholder: "Información adicional",
        name: "additionalInfo",
      },
    },
  },
  origin: {
    required: true,
    label: "Lugar de Origen",
    type: "text",
    placeholder: "Lugar de Origen",
    name: "origin",
  },
  reason: {
    required: true,
    label: "Motivo",
    type: "text",
    placeholder: "Motivo",
    name: "reason",
  },
  observations: {
    required: false,
    label: "Observaciones",
    type: "text",
    placeholder: "Observaciones",
    name: "observations",
  },
};
