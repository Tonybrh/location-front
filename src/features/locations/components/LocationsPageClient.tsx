"use client";

import { useState } from "react";
import { Location } from "@/types/location";
import { LocationService } from "@/features/locations/api/location.service";
import { MapComponent } from "@/features/map/components/MapComponent";
import { LocationList } from "./LocationList";
import { motion } from "framer-motion";
import { Navigation, Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { LocationForm } from "./CreateLocationForm";

interface LocationsPageClientProps {
    initialLocations: Location[];
}

export function LocationsPageClient({ initialLocations }: LocationsPageClientProps) {
    const [locations, setLocations] = useState(initialLocations);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [isRouteActive, setIsRouteActive] = useState(false);

    const [isAddingMode, setIsAddingMode] = useState(false);
    const [newLocationCoords, setNewLocationCoords] = useState<{ lat: number; lng: number } | null>(null);

    const [editingLocation, setEditingLocation] = useState<Location | null>(null);

    const handleSelectLocation = (location: Location) => {
        setSelectedLocation(location);
        setIsRouteActive(false);
    };

    const handleStartRoute = () => {
        if (selectedLocation) {
            setIsRouteActive(true);
        }
    };

    const handleMapClick = (coords: { lat: number; lng: number }) => {
        if (isAddingMode) {
            setNewLocationCoords(coords);
        }
    };

    const handleLocationCreated = (newLocation: Location) => {
        setLocations([...locations, newLocation]);
        setNewLocationCoords(null);
        setIsAddingMode(false);
        setSelectedLocation(newLocation);
    };

    const handleLocationUpdated = (updatedLocation: Location) => {
        setLocations(locations.map(loc => loc.id === updatedLocation.id ? updatedLocation : loc));
        setEditingLocation(null);
        if (selectedLocation?.id === updatedLocation.id) {
            setSelectedLocation(updatedLocation);
        }
    };

    const handleDeleteLocation = async (id: string) => {
        if (confirm("Are you sure you want to delete this location?")) {
            const success = await LocationService.delete(id);
            if (success) {
                setLocations(locations.filter(loc => loc.id !== id));
                if (selectedLocation?.id === id) {
                    setSelectedLocation(null);
                    setIsRouteActive(false);
                }
            }
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] gap-6 p-6">
            <div className="w-full lg:w-2/5 flex flex-col gap-4 overflow-hidden">
                <header className="mb-2 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Explore locais</h1>
                        <p className="text-gray-400">Selecione um destino ou crie um novo !</p>
                    </div>
                    <Button
                        variant={isAddingMode ? "destructive" : "default"}
                        size="sm"
                        onClick={() => {
                            setIsAddingMode(!isAddingMode);
                            setNewLocationCoords(null);
                        }}
                    >
                        {isAddingMode ? "Cancelar" : <><Plus className="w-4 h-4 mr-2" /> Adicionar local</>}
                    </Button>
                </header>

                {isAddingMode && (
                    <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg text-blue-200 text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Clique no mapa para adicionar um novo local.
                    </div>
                )}

                <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    <LocationList
                        locations={locations}
                        selectedLocationId={selectedLocation?.id}
                        onSelectLocation={handleSelectLocation}
                        onEditLocation={setEditingLocation}
                        onDeleteLocation={handleDeleteLocation}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: selectedLocation ? 1 : 0, y: selectedLocation ? 0 : 20 }}
                    className="p-4 bg-gray-800 rounded-xl border border-gray-700 shadow-xl"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Selecionado</p>
                            <p className="font-semibold text-white">{selectedLocation?.name || "None"}</p>
                        </div>
                        <button
                            onClick={handleStartRoute}
                            disabled={!selectedLocation || isRouteActive}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                        >
                            <Navigation className="w-4 h-4" />
                            {isRouteActive ? "Indo..." : "iniciar rota"}
                        </button>
                    </div>
                </motion.div>
            </div>

            <div className="w-full lg:w-3/5 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative">
                <MapComponent
                    selectedLocation={selectedLocation}
                    startRoute={isRouteActive}
                    onMapClick={handleMapClick}
                    className={isAddingMode ? "cursor-crosshair" : ""}
                />
            </div>

            <Dialog
                isOpen={!!newLocationCoords || !!editingLocation}
                onClose={() => {
                    setNewLocationCoords(null);
                    setEditingLocation(null);
                }}
                title={editingLocation ? "Editar local" : "Adicionar novo local"}
            >
                {(newLocationCoords || editingLocation) && (
                    <LocationForm
                        initialData={editingLocation || undefined}
                        latitude={newLocationCoords?.lat}
                        longitude={newLocationCoords?.lng}
                        onSuccess={editingLocation ? handleLocationUpdated : handleLocationCreated}
                        onCancel={() => {
                            setNewLocationCoords(null);
                            setEditingLocation(null);
                        }}
                    />
                )}
            </Dialog>
        </div>
    );
}
