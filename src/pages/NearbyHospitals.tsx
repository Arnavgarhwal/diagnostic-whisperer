import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Phone, Hospital, Clock, Star, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

interface NearbyPlace {
  id: string;
  name: string;
  address: string;
  distance: string;
  type: "hospital" | "clinic" | "pharmacy";
  rating?: number;
  isOpen?: boolean;
  phone?: string;
  lat: number;
  lng: number;
}

// Sample hospital data for different regions
const hospitalDatabase: NearbyPlace[] = [
  // India - Major cities
  { id: "1", name: "Apollo Hospital", address: "Jubilee Hills, Hyderabad", distance: "", type: "hospital", rating: 4.6, isOpen: true, phone: "+91 40 2360 7777", lat: 17.4325, lng: 78.4073 },
  { id: "2", name: "AIIMS Delhi", address: "Ansari Nagar, New Delhi", distance: "", type: "hospital", rating: 4.5, isOpen: true, phone: "+91 11 2658 8500", lat: 28.5672, lng: 77.2100 },
  { id: "3", name: "Fortis Hospital", address: "Bannerghatta Road, Bangalore", distance: "", type: "hospital", rating: 4.4, isOpen: true, phone: "+91 80 6621 4444", lat: 12.8931, lng: 77.5976 },
  { id: "4", name: "Max Super Specialty Hospital", address: "Saket, New Delhi", distance: "", type: "hospital", rating: 4.5, isOpen: true, phone: "+91 11 2651 5050", lat: 28.5285, lng: 77.2137 },
  { id: "5", name: "Medanta Hospital", address: "Sector 38, Gurugram", distance: "", type: "hospital", rating: 4.6, isOpen: true, phone: "+91 124 4141 414", lat: 28.4399, lng: 77.0423 },
  { id: "6", name: "KIMS Hospital", address: "Secunderabad, Hyderabad", distance: "", type: "hospital", rating: 4.3, isOpen: true, phone: "+91 40 4488 5000", lat: 17.4500, lng: 78.4983 },
  { id: "7", name: "Lilavati Hospital", address: "Bandra, Mumbai", distance: "", type: "hospital", rating: 4.4, isOpen: true, phone: "+91 22 2640 7655", lat: 19.0509, lng: 72.8290 },
  { id: "8", name: "Kokilaben Hospital", address: "Andheri, Mumbai", distance: "", type: "hospital", rating: 4.5, isOpen: true, phone: "+91 22 4269 6969", lat: 19.1314, lng: 72.8256 },
  // Clinics
  { id: "9", name: "MedPlus Clinic", address: "Local Area", distance: "", type: "clinic", rating: 4.2, isOpen: true, phone: "+91 99999 99999", lat: 17.4400, lng: 78.3500 },
  { id: "10", name: "Apollo Clinic", address: "Local Area", distance: "", type: "clinic", rating: 4.3, isOpen: true, phone: "+91 88888 88888", lat: 17.4350, lng: 78.3600 },
  { id: "11", name: "Practo Partner Clinic", address: "Local Area", distance: "", type: "clinic", rating: 4.1, isOpen: true, phone: "+91 77777 77777", lat: 17.4450, lng: 78.3700 },
  // Pharmacies
  { id: "12", name: "Apollo Pharmacy", address: "Local Area", distance: "", type: "pharmacy", rating: 4.0, isOpen: true, phone: "+91 66666 66666", lat: 17.4380, lng: 78.3550 },
  { id: "13", name: "MedPlus Pharmacy", address: "Local Area", distance: "", type: "pharmacy", rating: 4.1, isOpen: true, phone: "+91 55555 55555", lat: 17.4420, lng: 78.3650 },
  { id: "14", name: "Netmeds Store", address: "Local Area", distance: "", type: "pharmacy", rating: 4.0, isOpen: true, phone: "+91 44444 44444", lat: 17.4360, lng: 78.3750 },
];

const NearbyHospitals = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [filter, setFilter] = useState<"all" | "hospital" | "clinic" | "pharmacy">("all");

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setLocation({ lat: userLat, lng: userLng });
        findNearbyPlaces(userLat, userLng);
        toast({
          title: "Location Found",
          description: "Showing nearby healthcare facilities based on your location."
        });
      },
      (err) => {
        setError("Unable to get your location. Please enable location services.");
        setLoading(false);
        // Still show some results with default location
        findNearbyPlaces(17.4325, 78.4073); // Default to Hyderabad
      }
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearbyPlaces = (userLat: number, userLng: number) => {
    // Calculate distances and sort
    const placesWithDistance = hospitalDatabase.map(place => ({
      ...place,
      distance: calculateDistance(userLat, userLng, place.lat, place.lng).toFixed(1) + " km"
    })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    setPlaces(placesWithDistance);
    setLoading(false);
  };

  const handleGetDirections = (place: NearbyPlace) => {
    const query = encodeURIComponent(`${place.name} ${place.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const handleCall = (phone: string, name: string) => {
    window.location.href = `tel:${phone}`;
    toast({
      title: `Calling ${name}`,
      description: `Dialing ${phone}...`
    });
  };

  const filteredPlaces = filter === "all" ? places : places.filter(p => p.type === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hospital": return "🏥";
      case "clinic": return "🩺";
      case "pharmacy": return "💊";
      default: return "🏥";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "hospital": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "clinic": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "pharmacy": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <MapPin className="w-3 h-3 mr-1" />
              Location Based
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Nearby <span className="text-gradient">Healthcare</span> Facilities
            </h1>
            <p className="text-muted-foreground">
              Find hospitals, clinics, and pharmacies near you
            </p>
          </motion.div>

          {/* Location Status */}
          {location && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-primary/10 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">Using your current location</span>
              </div>
              <Button variant="ghost" size="sm" onClick={getUserLocation}>
                <Navigation className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-destructive/10 rounded-xl flex items-center gap-2 text-destructive"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
              <Button variant="outline" size="sm" className="ml-auto" onClick={getUserLocation}>
                Retry
              </Button>
            </motion.div>
          )}

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { value: "all", label: "All" },
              { value: "hospital", label: "Hospitals" },
              { value: "clinic", label: "Clinics" },
              { value: "pharmacy", label: "Pharmacies" },
            ].map((tab) => (
              <Button
                key={tab.value}
                variant={filter === tab.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(tab.value as any)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Finding nearby facilities...</p>
            </div>
          )}

          {/* Results */}
          {!loading && (
            <div className="space-y-4">
              {filteredPlaces.map((place, index) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                        {getTypeIcon(place.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold">{place.name}</h3>
                          <Badge className={getTypeColor(place.type)}>
                            {place.type}
                          </Badge>
                          <span className="text-xs px-2 py-0.5 bg-accent rounded-full">
                            {place.distance}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {place.address}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          {place.rating && (
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              {place.rating}
                            </span>
                          )}
                          {place.isOpen !== undefined && (
                            <span className={`flex items-center gap-1 ${place.isOpen ? "text-green-600" : "text-red-600"}`}>
                              <Clock className="w-3 h-3" />
                              {place.isOpen ? "Open now" : "Closed"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-16 md:ml-0">
                      {place.phone && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCall(place.phone!, place.name)}
                        >
                          <Phone className="w-4 h-4 mr-1" /> Call
                        </Button>
                      )}
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={() => handleGetDirections(place)}
                      >
                        <Navigation className="w-4 h-4 mr-1" /> Directions
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredPlaces.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Hospital className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No facilities found in this category</p>
                </div>
              )}
            </div>
          )}

          {/* Map Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-6 bg-gradient-to-br from-primary/10 to-health-coral/10 border border-primary/20 rounded-xl text-center"
          >
            <h3 className="font-semibold mb-2">View on Map</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Open in Google Maps to see all facilities with real-time directions
            </p>
            <Button
              variant="hero"
              onClick={() => {
                const query = location 
                  ? `https://www.google.com/maps/search/hospitals/@${location.lat},${location.lng},14z`
                  : "https://www.google.com/maps/search/hospitals+near+me";
                window.open(query, "_blank");
              }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Open Google Maps
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NearbyHospitals;
