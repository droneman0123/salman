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
        location: location ? `POINT(${location[0]} ${location[1]})` : null
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
            <button
              onClick={onBack}
              className="text-blue-500 hover:text-blue-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <h2 className="text-xl sm:text-2xl font-bold">Confirm Order</h2>
          </div>

          {selectedProduct && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{selectedProduct.name}</h3>
              <p className="text-gray-600 mb-2">{selectedProduct.description}</p>
              <p className="text-xl font-bold text-green-600">{formatINR(selectedProduct.price)}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <AddressInput onSubmit={handleAddressSubmit} />
            </div>

            {showMap && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Confirm Delivery Location</h3>
                <LocationPicker
                  onLocationSelect={setLocation}
                  initialPosition={location}
                />
              </div>
            )}

            {message && (
              <div className={`mb-4 p-3 rounded ${
                message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {message}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !location || !address}
                className={`px-6 py-2 rounded-lg text-white font-semibold ${
                  loading || !location || !address
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;