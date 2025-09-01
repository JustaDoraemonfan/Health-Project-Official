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
  Clock,
  Users,
} from "lucide-react";

export default function EmergencyMap() {
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [map, setMap] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [locationError, setLocationError] = useState("");
  const [userMarker, setUserMarker] = useState(null);
  const [hospitalMarkers, setHospitalMarkers] = useState([]);
  const [initialLocationSet, setInitialLocationSet] = useState(false);

  const emergencyServices = [
    {
      name: "Police",
      icon: Shield,
      number: "100",
      color: "text-blue-400",
      bg: "bg-blue-900/20",
      border: "border-blue-500/30",
    },
    {
      name: "Fire",
      icon: Zap,
      number: "101",
      color: "text-red-400",
      bg: "bg-red-900/20",
      border: "border-red-500/30",
    },
    {
      name: "Medical",
      icon: Activity,
      number: "102",
      color: "text-green-400",
      bg: "bg-green-900/20",
      border: "border-green-500/30",
    },
    {
      name: "Disaster",
      icon: AlertTriangle,
      number: "108",
      color: "text-amber-400",
      bg: "bg-amber-900/20",
      border: "border-amber-500/30",
    },
  ];

  const getLocationErrorMessage = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location access denied. Please enable location permissions.";
      case error.POSITION_UNAVAILABLE:
        return "Location information unavailable. Check your connection.";
      case error.TIMEOUT:
        return "Location request timed out. Please try again.";
      default:
        return "An unknown error occurred while fetching location.";
    }
  };

  const checkLocationPermission = async () => {
    if (!navigator.permissions) return "unknown";
    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      return permission.state;
    } catch {
      return "unknown";
    }
  };

  const setUserLocationAndHospitals = (position, isInitialLoad = false) => {
    const userLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    if (userMarker) userMarker.setMap(null);
    hospitalMarkers.forEach((m) => m.setMap(null));

    map.setCenter(userLocation);
    map.setZoom(15);

    const marker = new window.google.maps.Marker({
      position: userLocation,
      map,
      title: `You are here (±${Math.round(position.coords.accuracy)}m)`,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#3b82f6",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      },
    });

    new window.google.maps.Circle({
      strokeColor: "#3b82f6",
      strokeOpacity: 0.3,
      strokeWeight: 2,
      fillColor: "#3b82f6",
      fillOpacity: 0.1,
      map,
      center: userLocation,
      radius: position.coords.accuracy,
    });

    setUserMarker(marker);
    setLocationStatus("success");

    const service = new window.google.maps.places.PlacesService(map);
    service.nearbySearch(
      {
        location: userLocation,
        radius: 3000,
        type: ["hospital"],
      },
      (results, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          results
        ) {
          const markers = results.map((place) => {
            const hospitalMarker = new window.google.maps.Marker({
              position: place.geometry.location,
              map,
              title: place.name,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#ef4444",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              },
            });

            const infowindow = new window.google.maps.InfoWindow({
              content: `<div style="color:#000; padding: 8px;"><strong style="color:#ef4444;">${place.name}</strong><br><span style="color:#666;">${place.vicinity}</span></div>`,
            });

            hospitalMarker.addListener("click", () =>
              infowindow.open(map, hospitalMarker)
            );

            return hospitalMarker;
          });
          setHospitalMarkers(markers);
        }
      }
    );

    if (isInitialLoad) {
      setInitialLocationSet(true);
    }

    setTimeout(() => setLocationStatus("idle"), 3000);
  };

  const getUserLocationAutomatically = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setLocationStatus("error");
      return;
    }

    const permissionStatus = await checkLocationPermission();
    if (permissionStatus === "denied") {
      setLocationError("Location access denied. Please enable permissions.");
      setLocationStatus("error");
      return;
    }

    setLocationStatus("loading");
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocationAndHospitals(position, true);
      },
      (error) => {
        setLocationError(getLocationErrorMessage(error));
        setLocationStatus("error");
        setTimeout(() => setLocationStatus("idle"), 5000);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
    );
  };

  const handleLocateMe = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setLocationStatus("error");
      return;
    }

    const permissionStatus = await checkLocationPermission();
    if (permissionStatus === "denied") {
      setLocationError("Location access denied. Please enable permissions.");
      setLocationStatus("error");
      return;
    }

    setLocationStatus("loading");
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocationAndHospitals(position);
      },
      (error) => {
        setLocationError(getLocationErrorMessage(error));
        setLocationStatus("error");
        setTimeout(() => setLocationStatus("idle"), 5000);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
    );
  };

  useEffect(() => {
    const initMap = () => {
      if (window.google && window.google.maps) {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: 28.6139, lng: 77.209 },
          zoom: 12,
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            {
              featureType: "poi.business",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "poi.park",
              elementType: "labels.text",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        setMap(mapInstance);
        setIsMapLoaded(true);
      }
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      window.initMap = initMap;
    }
  }, []);

  useEffect(() => {
    if (map && isMapLoaded && !initialLocationSet) {
      setTimeout(() => {
        getUserLocationAutomatically();
      }, 100);
    }
  }, [map, isMapLoaded, initialLocationSet]);

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="bg-zinc-950/50 border-b border-slate-600 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-red-600/20 backdrop-blur-sm rounded-xl p-3 border border-red-500/30">
              <Activity className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Emergency Map</h1>
              <p className="text-slate-300 flex items-center space-x-1 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Find help nearby</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="bg-slate-700/50 backdrop-blur-sm hover:bg-slate-600/50 p-3 rounded-xl text-slate-300 hover:text-white transition-all duration-200 border border-slate-600"
          >
            {isPanelOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative flex h-[calc(100vh-80px)]">
        {/* Emergency Services Panel */}
        <div
          className={`${
            isPanelOpen ? "w-80" : "w-0"
          } transition-all duration-300 overflow-hidden bg-zinc-900 border-r border-slate-700`}
        >
          <div className="p-6 h-full overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Phone className="w-5 h-5 text-red-400" />
              <span>Emergency Services</span>
            </h2>

            <div className="space-y-4">
              {emergencyServices.map((service) => (
                <div
                  key={service.name}
                  className={`${service.bg} ${service.border} rounded-xl p-4 border backdrop-blur-sm hover:bg-opacity-30 transition-all duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-slate-700/50 rounded-lg p-2">
                        <service.icon className={`w-5 h-5 ${service.color}`} />
                      </div>
                      <div>
                        <span className="font-semibold text-white">
                          {service.name}
                        </span>
                        <p className="text-xs text-slate-400">
                          Emergency hotline
                        </p>
                      </div>
                    </div>
                    <a
                      href={`tel:${service.number}`}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="font-medium">{service.number}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-amber-900/20 rounded-xl border border-amber-500/30 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="font-medium text-amber-300">Quick Tip</span>
              </div>
              <p className="text-sm text-amber-200">
                In medical emergencies, call 102 first. If no response, try 108
                or local hospital numbers.
              </p>
            </div>

            <div className="mt-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600">
              <h3 className="font-semibold text-white mb-3 flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Map Legend</span>
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-300">Your location</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-slate-300">Hospitals nearby</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative bg-slate-900">
          <div ref={mapRef} className="w-full h-full"></div>

          {/* Status Messages */}
          {locationStatus === "loading" && (
            <div className="absolute top-4 left-4 right-4 bg-blue-600/90 backdrop-blur-sm text-white p-4 rounded-xl shadow-lg flex items-center space-x-3 border border-blue-500/50">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="font-medium">Locating you...</span>
            </div>
          )}

          {locationStatus === "error" && locationError && (
            <div className="absolute top-4 left-4 right-4 bg-red-600/90 backdrop-blur-sm text-white p-4 rounded-xl shadow-lg border border-red-500/50">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium text-sm">{locationError}</span>
              </div>
            </div>
          )}

          {locationStatus === "success" && (
            <div className="absolute top-4 left-4 right-4 bg-green-600/90 backdrop-blur-sm text-white p-4 rounded-xl shadow-lg border border-green-500/50">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span className="font-medium text-sm">
                  Location found! Showing nearby hospitals.
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute bottom-6 right-6 flex flex-col space-y-3">
            <button
              onClick={handleLocateMe}
              disabled={locationStatus === "loading"}
              className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm border ${
                locationStatus === "loading"
                  ? "bg-slate-600/80 cursor-not-allowed border-slate-500"
                  : "bg-blue-600/90 hover:bg-blue-700/90 hover:scale-110 border-blue-500/50"
              }`}
              title="Find my location"
            >
              {locationStatus === "loading" ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Navigation className="w-6 h-6" />
              )}
            </button>

            <a
              href="tel:112"
              className="bg-red-600/90 hover:bg-red-700/90 backdrop-blur-sm text-white px-5 py-3 rounded-full shadow-xl flex items-center space-x-2 transition-all duration-200 hover:scale-105 border border-red-500/50"
              title="Emergency Call"
            >
              <Phone className="w-5 h-5" />
              <span className="font-bold">112</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
