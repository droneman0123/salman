import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapComponent({ position, onLocationSelect }) {
  const map = useMap();

  useEffect(() => {
    if (map && position) {
      map.setView(position, 13);
    }
  }, [map, position]);

  const handleMapClick = useCallback((e) => {
    onLocationSelect(e.latlng);
  }, [onLocationSelect]);

  useEffect(() => {
    if (map) {
      map.on('click', handleMapClick);
      return () => {
        map.off('click', handleMapClick);
      };
    }
  }, [map, handleMapClick]);

  return (
    <Marker position={position} />
  );
}

function LocationPicker({ onLocationSelect, initialPosition }) {
  const [position, setPosition] = useState(initialPosition || [12.9716, 77.5946]); // Bangalore coordinates

  const handleLocationSelect = (latlng) => {
    setPosition([latlng.lat, latlng.lng]);
    onLocationSelect([latlng.lat, latlng.lng]);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = [position.coords.latitude, position.coords.longitude];
          setPosition(newPosition);
          onLocationSelect(newPosition);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div>
      <button 
        onClick={getCurrentLocation}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Use Current Location
      </button>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapComponent position={position} onLocationSelect={handleLocationSelect} />
      </MapContainer>
    </div>
  );
}

export default LocationPicker;