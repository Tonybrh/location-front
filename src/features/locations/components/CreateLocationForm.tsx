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
        imageUrl: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const newLocation = await LocationService.create({
            ...formData,
            latitude,
            longitude,
        });

        setIsLoading(false);

        if (newLocation) {
            onSuccess(newLocation);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Christ the Redeemer"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="A brief description of the place..."
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                    id="imageUrl"
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            <div className="pt-2 flex gap-3 justify-end">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Location"}
                </Button>
            </div>
        </form>
    );
}
