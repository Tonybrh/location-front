import { LocationService } from "@/features/locations/api/location.service";
import { LocationsPageClient } from "@/features/locations/components/LocationsPageClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const locations = await LocationService.getAll();

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <LocationsPageClient initialLocations={locations} />
    </main>
  );
}
