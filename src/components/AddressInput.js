import React, { useState, useEffect } from 'react';
import { saveUserAddress, getUserAddresses, setDefaultAddress } from '../services/addressService';

const AddressInput = ({ onAddressSubmit }) => {
  const [address, setAddress] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSavedAddresses();
  }, []);

  const loadSavedAddresses = async () => {
    try {
      const addresses = await getUserAddresses();
      setSavedAddresses(addresses);
    } catch (err) {
      console.error('Failed to load addresses:', err);
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          );
          const data = await response.json();
          
          const addressData = {
            formattedAddress: data.display_name,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          };

          // Save the address to Supabase
          await saveUserAddress(addressData);
          await loadSavedAddresses();

          setAddress(addressData.formattedAddress);
          onAddressSubmit(addressData);
        } catch (err) {
          setError('Failed to get address from coordinates');
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        setError('Failed to get your location. Please enter your address manually.');
        setIsLoading(false);
      }
    );
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (address.trim()) {
      try {
        const addressData = { formattedAddress: address };
        await saveUserAddress(addressData);
        await loadSavedAddresses();
        onAddressSubmit(addressData);
      } catch (err) {
        setError('Failed to save address');
      }
    }
  };

  const handleSavedAddressSelect = async (savedAddress) => {
    try {
      await setDefaultAddress(savedAddress.id);
      await loadSavedAddresses();
      
      const addressData = {
        formattedAddress: savedAddress.formatted_address,
        coordinates: savedAddress.latitude && savedAddress.longitude
          ? {
              lat: savedAddress.latitude,
              lng: savedAddress.longitude
            }
          : null
      };
      
      setAddress(savedAddress.formatted_address);
      onAddressSubmit(addressData);
    } catch (err) {
      setError('Failed to select address');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>

      {savedAddresses.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Saved Addresses</h3>
          <div className="space-y-2">
            {savedAddresses.map((savedAddress) => (
              <button
                key={savedAddress.id}
                onClick={() => handleSavedAddressSelect(savedAddress)}
                className={`w-full p-2 text-left text-sm border rounded-lg transition-colors ${
                  savedAddress.is_default
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-500'
                }`}
              >
                <p className="font-medium">{savedAddress.formatted_address}</p>
                {savedAddress.is_default && (
                  <span className="text-xs text-blue-600">Default Address</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={getCurrentLocation}
        disabled={isLoading}
        className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
      >
        {isLoading ? (
          <span>Getting location...</span>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Use Current Location
          </>
        )}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      <form onSubmit={handleManualSubmit} className="mt-4">
        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter Address Manually
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            placeholder="Enter your full address"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={!address.trim()}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save & Use This Address
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default AddressInput;
