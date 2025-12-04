"use client";

import { Location } from "@/types/location";
import { LocationCard } from "./LocationCard";

interface LocationListProps {
    locations: Location[];
    selectedLocationId?: string | null;
    onSelectLocation: (location: Location) => void;
    onDeleteLocation: (id: string) => void;
}

export function LocationList({ locations, selectedLocationId, onSelectLocation, onDeleteLocation }: LocationListProps) {
    if (!locations.length) {
        return (
            <div className="text-center py-10 text-gray-400">
                <p>No locations found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
                <LocationCard
                    key={location.id}
                    location={location}
                    isSelected={selectedLocationId === location.id}
                    onSelect={onSelectLocation}
                    onDelete={onDeleteLocation}
                />
            ))}
        </div>
    );
}
