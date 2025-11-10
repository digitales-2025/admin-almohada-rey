import * as z from "zod";

export const toggleBlacklistSchema = z
  .object({
    isBlacklist: z.boolean({
      required_error: "El estado de blacklist es requerido",
    }),
    blacklistReason: z.string().optional(),
    blacklistDate: z.string().optional(),
  })
  .refine(
    (data) => {
      // Si isBlacklist es true, blacklistReason y blacklistDate son requeridos
      if (data.isBlacklist === true) {
        return !!data.blacklistReason && !!data.blacklistDate;
      }
      return true;
    },
    {
      message: "La razón y la fecha son requeridas cuando se agrega a la lista negra",
      path: ["blacklistReason"], // El error aparecerá en el campo blacklistReason
    }
  )
  .refine(
    (data) => {
      // Si isBlacklist es true, validar que blacklistDate sea una fecha válida
      if (data.isBlacklist === true && data.blacklistDate) {
        const parsedDate = new Date(data.blacklistDate);
        return !isNaN(parsedDate.getTime());
      }
      return true;
    },
    {
      message: "Formato de fecha inválido",
      path: ["blacklistDate"],
    }
  )
  .refine(
    (data) => {
      // Si isBlacklist es true, validar que blacklistReason tenga al menos 2 caracteres
      if (data.isBlacklist === true && data.blacklistReason) {
        return data.blacklistReason.trim().length >= 2;
      }
      return true;
    },
    {
      message: "La razón debe tener al menos 2 caracteres",
      path: ["blacklistReason"],
    }
  );

export type ToggleBlacklistSchema = z.infer<typeof toggleBlacklistSchema>;
