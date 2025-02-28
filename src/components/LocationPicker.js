import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapComponent({ position, onLocationSelect }) {
  const map = useMap();

  useEffect(() => {
    if (map && position) {
      map.setView(position, 13);
    }
  }, [map, position]);

  const handleMapClick = useCallback((e) => {
    onLocationSelect([e.latlng.lat, e.latlng.lng]);
  }, [onLocationSelect]);

  useEffect(() => {
    if (map) {
      map.on('click', handleMapClick);
      return () => {
        map.off('click', handleMapClick);
      };
    }
  }, [map, handleMapClick]);

  return position ? <Marker position={position} /> : null;
}

function LocationPicker({ onLocationSelect, initialPosition }) {
  const [position, setPosition] = useState(initialPosition || [12.9716, 77.5946]); // Bangalore coordinates
  const [mapKey, setMapKey] = useState(0); // Add key to force re-render

  const handleLocationSelect = (newPosition) => {
    setPosition(newPosition);
    onLocationSelect(newPosition);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const newPosition = [location.coords.latitude, location.coords.longitude];
          setPosition(newPosition);
          onLocationSelect(newPosition);
          setMapKey(prev => prev + 1); // Force map re-render with new position
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location. Please select manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={getCurrentLocation}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        type="button"
      >
        Use Current Location
      </button>
      <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          key={mapKey}
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapComponent position={position} onLocationSelect={handleLocationSelect} />
        </MapContainer>
      </div>
      <p className="text-sm text-gray-600">
        Click on the map to select delivery location
      </p>
    </div>
  );
}

export default LocationPicker;