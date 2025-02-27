import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

const defaultIcon = L.icon({
  iconUrl: '/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function MapComponent({ position, onLocationSelect }) {
  const map = useMap();
  const markerRef = React.useRef(null);

  useEffect(() => {
    if (!markerRef.current) {
      markerRef.current = L.marker(position, { icon: defaultIcon }).addTo(map);
    }
    
    if (map && position) {
      map.setView(position, 13);
      markerRef.current.setLatLng(position);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
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

  return null;
}

function LocationPicker({ onLocationSelect, initialPosition }) {
  const [position, setPosition] = useState(initialPosition || [12.9716, 77.5946]);

  const handleLocationSelect = (latlng) => {
    setPosition([latlng.lat, latlng.lng]);
    onLocationSelect([latlng.lat, latlng.lng]);
  };

  return (
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
  );
}

export default LocationPicker;