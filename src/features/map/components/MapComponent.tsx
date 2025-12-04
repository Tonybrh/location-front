"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Location } from "@/types/location";
import { cn } from "@/lib/utils";

interface MapComponentProps {
    selectedLocation: Location | null;
    startRoute: boolean;
    className?: string;
    onMapClick?: (coords: { lat: number; lng: number }) => void;
}

export function MapComponent({ selectedLocation, startRoute, className, onMapClick }: MapComponentProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onMapClickRef = useRef(onMapClick);

    useEffect(() => {
        onMapClickRef.current = onMapClick;
    }, [onMapClick]);

    useEffect(() => {
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (!token) {
            setError("Missing Mapbox Token");
            return;
        }

        mapboxgl.accessToken = token;

        if (mapContainer.current && !map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/dark-v11",
                center: [-47.8825, -15.7942],
                zoom: 4,
            });

            map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

            // Geolocate control to track user
            const geolocate = new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackUserLocation: true,
                showUserHeading: true,
            });

            map.current.addControl(geolocate, "top-right");

            geolocate.on("geolocate", (e: any) => {
                const { longitude, latitude } = e.coords;
                setUserLocation([longitude, latitude]);
            });

            map.current.on("load", () => {
                geolocate.trigger();
            });

            map.current.on("click", (e) => {
                if (onMapClickRef.current) {
                    onMapClickRef.current({ lat: e.lngLat.lat, lng: e.lngLat.lng });
                }
            });
        }

        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, []);

    useEffect(() => {
        if (!map.current || !selectedLocation) return;

        map.current.flyTo({
            center: [selectedLocation.longitude, selectedLocation.latitude],
            zoom: 14,
            essential: true,
        });

        const marker = new mapboxgl.Marker({ color: "#3b82f6" })
            .setLngLat([selectedLocation.longitude, selectedLocation.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${selectedLocation.name}</h3>`))
            .addTo(map.current);

        return () => {
            marker.remove();
        };
    }, [selectedLocation]);

    useEffect(() => {
        if (!startRoute || !userLocation || !selectedLocation || !map.current) return;

        const getRoute = async () => {
            try {
                const query = await fetch(
                    `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation[0]},${userLocation[1]};${selectedLocation.longitude},${selectedLocation.latitude}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
                );
                const json = await query.json();
                const data = json.routes[0];
                const route = data.geometry.coordinates;

                const geojson: GeoJSON.Feature<GeoJSON.Geometry> = {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "LineString",
                        coordinates: route,
                    },
                };

                if (map.current?.getSource("route")) {
                    (map.current.getSource("route") as mapboxgl.GeoJSONSource).setData(geojson as any);
                } else {
                    map.current?.addLayer({
                        id: "route",
                        type: "line",
                        source: {
                            type: "geojson",
                            data: geojson as any,
                        },
                        layout: {
                            "line-join": "round",
                            "line-cap": "round",
                        },
                        paint: {
                            "line-color": "#3b82f6",
                            "line-width": 5,
                            "line-opacity": 0.75,
                        },
                    });
                }

                const bounds = new mapboxgl.LngLatBounds();
                route.forEach((coord: [number, number]) => bounds.extend(coord));
                map.current?.fitBounds(bounds, { padding: 50 });

            } catch (err) {
                console.error("Error fetching route:", err);
            }
        };

        getRoute();
    }, [startRoute, userLocation, selectedLocation]);

    return (
        <div className={cn("relative w-full h-full rounded-xl overflow-hidden", className)}>
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-red-400 z-50">
                    {error}
                </div>
            )}
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
}
