import React, { useState, useEffect } from 'react';
import { L, MapContainer, TileLayer, Marker, useMap } from './MapImports';

// Simple marker icon setup
const icon = L.icon({
  iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapComponent({ position, onLocationSelect }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);

  map.on('click', (e) => {
    onLocationSelect(e.latlng);
  });

  return null;
}

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
  const [position, setPosition] = useState(initialLocation);
  const [loading, setLoading] = useState(!initialLocation);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialLocation) {
      setPosition(initialLocation);
      setLoading(false);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setPosition(newPos);
          onLocationSelect(newPos);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
          // Default to a fallback location
          const defaultPos = { lat: 51.505, lng: -0.09 };
          setPosition(defaultPos);
          onLocationSelect(defaultPos);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      // Default to a fallback location
      const defaultPos = { lat: 51.505, lng: -0.09 };
      setPosition(defaultPos);
      onLocationSelect(defaultPos);
    }
  }, [onLocationSelect, initialLocation]);

  useEffect(() => {
    if (initialLocation && initialLocation !== position) {
      setPosition(initialLocation);
    }
  }, [initialLocation]);

  if (loading) {
    return <div className="text-center py-4">Loading map...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={position || [51.505, -0.09]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {position && (
          <Marker position={position} icon={icon} />
        )}
        <MapComponent position={position} onLocationSelect={(pos) => {
          setPosition(pos);
          onLocationSelect(pos);
        }} />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;