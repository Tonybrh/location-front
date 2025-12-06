"use client";

import { Location } from "@/types/location";
import { LocationCard } from "./LocationCard";
import { motion } from "framer-motion";

interface LocationListProps {
    locations: Location[];
    selectedLocationId?: string | null;
    onSelectLocation: (location: Location) => void;
    onEditLocation: (location: Location) => void;
    onDeleteLocation: (id: string) => void;
}

export function LocationList({ locations, selectedLocationId, onSelectLocation, onEditLocation, onDeleteLocation }: LocationListProps) {
    if (!locations.length) {
        return (
            <div className="text-center py-10 text-gray-400">
                <p>No locations found.</p>
            </div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 pl-3"
        >
            {locations.map((location) => (
                <LocationCard
                    key={location.id}
                    location={location}
                    isSelected={selectedLocationId === location.id}
                    onSelect={onSelectLocation}
                    onEdit={onEditLocation}
                    onDelete={onDeleteLocation}
                />
            ))}
        </motion.div>
    );
}
