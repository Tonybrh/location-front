"use client";

import { Location } from "@/types/location";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MapPin, Trash2 } from "lucide-react";

interface LocationCardProps {
    location: Location;
    isSelected?: boolean;
    onSelect: (location: Location) => void;
    onDelete: (id: string) => void;
}

export function LocationCard({ location, isSelected, onSelect, onDelete }: LocationCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            onClick={() => onSelect(location)}
            className={cn(
                "group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 shadow-lg cursor-pointer transition-all duration-300",
                isSelected ? "ring-2 ring-blue-500 bg-white/10" : "hover:bg-white/10"
            )}
        >
            {/* Image Placeholder or Actual Image */}
            <div className="aspect-video w-full overflow-hidden bg-gray-800 relative">
                {location.imageUrl ? (
                    <img
                        src={location.imageUrl}
                        alt={location.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                        <MapPin className="h-10 w-10" />
                    </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Delete Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(location.id);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Location"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="p-4 relative">
                <h3 className="text-lg font-bold text-white mb-1">{location.name}</h3>
                <p className="text-sm text-gray-300 line-clamp-2">{location.description}</p>

                {isSelected && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 pt-3 border-t border-white/10"
                    >
                        <p className="text-xs text-blue-400 font-semibold">Selected Destination</p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
