import React, { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Navigation,
  Phone,
  Shield,
  Zap,
  Activity,
  AlertTriangle,
  Menu,
  X,
} from "lucide-react";

export default function EmergencyMap() {
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [map, setMap] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle"); // idle, loading, success, error
  const [locationError, setLocationError] = useState("");
  const [userMarker, setUserMarker] = useState(null);

  const emergencyServices = [
    { name: "Police", icon: Shield, number: "100", color: "text-blue-400" },
    { name: "Fire", icon: Zap, number: "101", color: "text-red-400" },
    { name: "Medical", icon: Activity, number: "102", color: "text-green-400" },
    {
      name: "Disaster",
      icon: AlertTriangle,
      number: "108",
      color: "text-yellow-400",
    },
  ];

  const getLocationErrorMessage = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location access denied. Please enable location permissions in your browser settings.";
      case error.POSITION_UNAVAILABLE:
        return "Location information unavailable. Please check your GPS/WiFi connection.";
      case error.TIMEOUT:
        return "Location request timed out. Please try again.";
      default:
        return "An unknown error occurred while fetching location.";
    }
  };

  const checkLocationPermission = async () => {
    if (!navigator.permissions) {
      return "unknown";
    }

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      return permission.state; // 'granted', 'denied', or 'prompt'
    } catch (error) {
      return "unknown";
    }
  };

  const handleLocateMe = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setLocationStatus("error");
      return;
    }

    // Check permission status first
    const permissionStatus = await checkLocationPermission();
    if (permissionStatus === "denied") {
      setLocationError(
        "Location access denied. Please enable location permissions in your browser settings."
      );
      setLocationStatus("error");
      return;
    }

    setLocationStatus("loading");
    setLocationError("");

    const options = {
      enableHighAccuracy: true,
      timeout: 15000, // 15 seconds
      maximumAge: 300000, // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Remove previous user marker if it exists
        if (userMarker) {
          userMarker.setMap(null);
        }

        // Center the map
        map.setCenter(userLocation);
        map.setZoom(15);

        // Add a marker for user location
        const marker = new window.google.maps.Marker({
          position: userLocation,
          map,
          title: `You are here (Accuracy: ±${Math.round(
            position.coords.accuracy
          )}m)`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#3b82f6",
            fillOpacity: 0.9,
            strokeColor: "#000000",
            strokeWeight: 3,
          },
        });

        // Add accuracy circle
        new window.google.maps.Circle({
          strokeColor: "#3b82f6",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#3b82f6",
          fillOpacity: 0.15,
          map,
          center: userLocation,
          radius: position.coords.accuracy,
        });

        setUserMarker(marker);
        setLocationStatus("success");

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setLocationStatus("idle");
        }, 3000);
      },
      (error) => {
        const errorMessage = getLocationErrorMessage(error);
        setLocationError(errorMessage);
        setLocationStatus("error");

        // Auto-hide error message after 5 seconds
        setTimeout(() => {
          setLocationStatus("idle");
        }, 5000);
      },
      options
    );
  };

  useEffect(() => {
    const initMap = () => {
      if (window.google && window.google.maps) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 28.6139, lng: 77.209 },
          zoom: 12,
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              // stylers: [{ color: "#2d3748" }],
            },
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#000000" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              // stylers: [{ color: "#1a365d" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              // stylers: [{ color: "#4a5568" }],
            },
          ],
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        new window.google.maps.Marker({
          position: { lat: 28.6139, lng: 77.209 },
          map,
          title: "Emergency Center",
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#ef4444",
            fillOpacity: 1,
            strokeColor: "#000000",
            strokeWeight: 2,
          },
        });
        setMap(map);
        setIsMapLoaded(true);
      }
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = initMap;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Full Screen Map */}
      <div ref={mapRef} className="w-full h-full bg-gray-900"></div>

      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-red-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-light">Loading emergency map...</p>
          </div>
        </div>
      )}

      {/* Location Status Messages */}
      {locationStatus !== "idle" && (
        <div
          className={`absolute top-24 right-4 max-w-sm p-4 rounded-lg shadow-lg border transition-all duration-300 z-50 ${
            locationStatus === "loading"
              ? "bg-blue-900/90 border-blue-600"
              : locationStatus === "success"
              ? "bg-green-900/90 border-green-600"
              : "bg-red-900/90 border-red-600"
          }`}
        >
          <div className="flex items-start space-x-3">
            {locationStatus === "loading" && (
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0 mt-0.5"></div>
            )}
            {locationStatus === "success" && (
              <Navigation className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            )}
            {locationStatus === "error" && (
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  locationStatus === "loading"
                    ? "text-blue-100"
                    : locationStatus === "success"
                    ? "text-green-100"
                    : "text-red-100"
                }`}
              >
                {locationStatus === "loading" && "Getting your location..."}
                {locationStatus === "success" && "Location found successfully!"}
                {locationStatus === "error" && "Location Error"}
              </p>
              {locationStatus === "loading" && (
                <p className="text-blue-200 text-xs mt-1">
                  This may take a few seconds
                </p>
              )}
              {locationStatus === "error" && (
                <p className="text-red-200 text-xs mt-1">{locationError}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-b border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-red-400" />
            <div>
              <h1 className="text-lg font-semibold text-white">
                Emergency Response Center
              </h1>
              <p className="text-gray-400 text-sm">New Delhi, India</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-green-400 text-sm font-medium">Live</span>
            </div>
            <button
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="p-2 bg-gray-800 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
            >
              {isPanelOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Services Panel */}
      <div
        className={`absolute top-20 left-4 w-80 bg-black/90 backdrop-blur-md rounded-lg border border-gray-700 transition-all duration-300 ${
          isPanelOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-full pointer-events-none"
        }`}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Emergency Services
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {emergencyServices.map((service) => {
              const Icon = service.icon;
              return (
                <a
                  key={service.name}
                  href={`tel:${service.number}`}
                  className="bg-gray-800/80 rounded-lg p-3 border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-5 h-5 ${service.color}`} />
                    <Phone className="w-4 h-4 text-gray-500" />
                  </div>
                  <h3 className="text-white font-medium text-sm mb-1">
                    {service.name}
                  </h3>
                  <p className="text-lg font-bold text-white">
                    {service.number}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-700">
        <div className="grid grid-cols-3 gap-6 p-4 text-center">
          <div>
            <div className="text-xl font-bold text-white mb-1">24/7</div>
            <div className="text-gray-400 text-sm">Available</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white mb-1">&lt;5min</div>
            <div className="text-gray-400 text-sm">Response Time</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white mb-1">GPS</div>
            <div className="text-gray-400 text-sm">Enabled</div>
          </div>
        </div>
      </div>

      {/* Floating Action Button - Locate Me */}
      <button
        onClick={handleLocateMe}
        disabled={locationStatus === "loading"}
        className={`absolute bottom-24 right-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-200 ${
          locationStatus === "loading"
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 hover:scale-105"
        }`}
      >
        {locationStatus === "loading" ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Navigation className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
