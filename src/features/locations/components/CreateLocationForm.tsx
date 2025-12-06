"use client";

import { useState } from "react";
import { LocationService } from "@/features/locations/api/location.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Location } from "@/types/location";
import { createLocationSchema, updateLocationSchema } from "@/schemas/location.schema";
import { z } from "zod";

interface LocationFormProps {
    initialData?: Location;
    latitude?: number;
    longitude?: number;
    onSuccess: (location: Location) => void;
    onCancel: () => void;
}

export function LocationForm({ initialData, latitude, longitude, onSuccess, onCancel }: LocationFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            // If editing, we might not have lat/lng if they aren't changing, or we use existing
            const lat = latitude ?? initialData?.latitude ?? 0;
            const lng = longitude ?? initialData?.longitude ?? 0;

            const schema = initialData ? updateLocationSchema : createLocationSchema;

            const validatedData = schema.parse({
                name: formData.name,
                description: formData.description,
                latitude: lat,
                longitude: lng,
                image: imageFile || (initialData?.imageUrl ? null : undefined), // null/undefined handling for optional
            });

            setIsLoading(true);
            const formDataObj = new FormData();
            formDataObj.append("name", validatedData.name);
            formDataObj.append("description", validatedData.description);
            formDataObj.append("latitude", validatedData.latitude.toString());
            formDataObj.append("longitude", validatedData.longitude.toString());

            if (validatedData.image instanceof File) {
                formDataObj.append("image", validatedData.image);
            }

            let result: Location | null;
            if (initialData) {
                result = await LocationService.update(initialData.id, formDataObj);
            } else {
                result = await LocationService.createWithFile(formDataObj);
            }

            setIsLoading(false);

            if (result) {
                onSuccess(result);
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.issues.forEach((err) => {
                    const field = err.path[0] as string;
                    fieldErrors[field] = err.message;
                });
                setErrors(fieldErrors);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Cristo redentor"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Uma breve descrição sobre o local..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="imageFile">Imagem (até 5 MB)</Label>
                <Input
                    id="imageFile"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setImageFile(file);
                        if (errors.image) {
                            setErrors({ ...errors, image: "" });
                        }
                    }}
                />
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                <p className="text-gray-400 text-sm mt-1">
                    {initialData ? "Deixe em branco para manter a imagem atual." : "Selecione um arquivo de imagem (máximo 5MB). Formatos aceitos: PNG, JPG, JPEG e WEBP"}
                </p>
            </div>

            <div className="pt-2 flex gap-3 justify-end">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (initialData ? "Salvando..." : "Criando...") : (initialData ? "Salvar alterações" : "Criar local")}
                </Button>
            </div>
        </form>
    );
}
