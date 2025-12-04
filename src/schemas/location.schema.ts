import { z } from "zod";

export const locationSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").max(100, "O nome deve ter no máximo 100 caracteres"),
    description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres").max(500, "A descrição deve ter no máximo 500 caracteres"),
    latitude: z.number().min(-90, "Latitude inválida").max(90, "Latitude inválida"),
    longitude: z.number().min(-180, "Longitude inválida").max(180, "Longitude inválida"),
});

export const createLocationSchema = locationSchema.extend({
    image: z.instanceof(File, { message: "Imagem é obrigatória" })
        .refine((file) => file.size <= 5 * 1024 * 1024, "A imagem deve ser menor que 5MB")
        .refine(
            (file) => ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type),
            "Formato de imagem inválido. Use PNG, JPG, JPEG ou WEBP"
        ),
});

export type LocationFormData = z.infer<typeof createLocationSchema>;
