"use client";

import { useState } from "react";
import { LocationService } from "@/features/locations/api/location.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Location } from "@/types/location";

interface CreateLocationFormProps {
    latitude: number;
    longitude: number;
    onSuccess: (location: Location) => void;
    onCancel: () => void;
}

export function CreateLocationForm({ latitude, longitude, onSuccess, onCancel }: CreateLocationFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            setError("Please select an image file.");
            return;
        }
        if (imageFile.size > 5 * 1024 * 1024) {
            setError("Image must be smaller than 5MB.");
            return;
        }
        setError("");
        setIsLoading(true);
        const formDataObj = new FormData();
        formDataObj.append("name", formData.name);
        formDataObj.append("description", formData.description);
        formDataObj.append("latitude", latitude.toString());
        formDataObj.append("longitude", longitude.toString());
        formDataObj.append("image", imageFile);
        const newLocation = await LocationService.createWithFile(formDataObj);
        setIsLoading(false);
        if (newLocation) {
            onSuccess(newLocation);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Cristo redentor"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Uma breve descrição sobre o local..."
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="imageFile">Imagem (até 5 MB)</Label>
                <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setImageFile(file);
                    }}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                <p className="text-gray-400 text-sm mt-1">Selecione um arquivo de imagem (máximo 5 MB).</p>
            </div>

            <div className="pt-2 flex gap-3 justify-end">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Location"}
                </Button>
            </div>
        </form>
    );
}
