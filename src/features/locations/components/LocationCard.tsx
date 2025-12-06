"use client";

import { Location } from "@/types/location";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MapPin, Trash2, Pencil } from "lucide-react";

interface LocationCardProps {
    location: Location;
    isSelected?: boolean;
    onSelect: (location: Location) => void;
    onEdit: (location: Location) => void;
    onDelete: (id: string) => void;
}

export function LocationCard({ location, isSelected, onSelect, onEdit, onDelete }: LocationCardProps) {
    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            layout
            variants={item}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => onSelect(location)}
            className={cn(
                "group relative overflow-hidden rounded-2xl border shadow-lg cursor-pointer transition-colors duration-300",
                isSelected
                    ? "bg-white/10 border-blue-500/50 ring-2 ring-blue-500/20"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
            )}
        >
            <div className="aspect-video w-full overflow-hidden bg-gray-900 relative">
                {location.imageUrl ? (
                    <img
                        src={location.imageUrl}
                        alt={location.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-600 group-hover:text-gray-500 transition-colors">
                        <MapPin className="h-12 w-12" />
                    </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(location);
                        }}
                        className="p-2 bg-blue-500/90 hover:bg-blue-600 text-white rounded-full shadow-lg transition-colors"
                        title="Edit Location"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(location.id);
                        }}
                        className="p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                        title="Delete Location"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="p-5 relative">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">{location.name}</h3>
                <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">{location.description}</p>

                {isSelected && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-white/10"
                    >
                        <div className="flex items-center gap-2 text-blue-400">
                            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            <p className="text-xs font-bold uppercase tracking-wider">Destino selecionado</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
