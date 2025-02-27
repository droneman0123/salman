import React, { useState } from 'react';
import LocationPicker from './LocationPicker';
import AddressInput from './AddressInput';
import { createOrder } from '../services/orderService';
import { formatINR } from '../utils/currency';

const OrderForm = ({ onOrderPlaced, selectedProduct, onBack }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showMap, setShowMap] = useState(false);

  const handleAddressSubmit = (addressData) => {
    setAddress(addressData);
    if (addressData.coordinates) {
      setLocation(addressData.coordinates);
      setShowMap(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderData = {
        product_id: selectedProduct.id,
        item: selectedProduct.name,
        price: selectedProduct.price,
        delivery_address: address.formattedAddress,
        location: location ? `POINT(${location.lng} ${location.lat})` : null
      };

      const data = await createOrder(orderData);
      setMessage('Order placed successfully!');
      onOrderPlaced(data.id);
    } catch (error) {
      console.error('Order submission error:', error);
      setMessage('Error placing order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">Confirm Order</h2>
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
          </div>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 flex-shrink-0">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div>
                <h3 className="font-semibold">{selectedProduct.name}</h3>
                <p className="text-gray-600 text-sm">{selectedProduct.description}</p>
                <p className="text-blue-600 font-bold mt-1">{formatINR(selectedProduct.price)}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <AddressInput onAddressSubmit={handleAddressSubmit} />
          </div>

          {showMap && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Confirm Location on Map</h3>
              <LocationPicker onLocationSelect={setLocation} initialLocation={location} />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !address}
            className="w-full py-3 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition duration-200 disabled:opacity-50 text-center font-medium"
          >
            {loading ? 'Placing Order...' : 'Confirm Order'}
          </button>

          {message && (
            <div className={`mt-4 p-3 text-sm text-center rounded-lg ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderForm;