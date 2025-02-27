import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import OtpVerification from '../components/OtpVerification';

function OrderPage() {
  const [item, setItem] = useState('');
  const [location, setLocation] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
      const { data, error } = await supabase
        .from('orders')
        .insert([{ item, location, otp }]);

      if (error) {
        console.error('Error submitting order:', error);
        alert('Failed to place order. Please try again.');
      } else {
        console.log('Order submitted successfully:', data);
        alert(`Order placed successfully! Your OTP is: ${otp}`);
        setItem('');
        setLocation('');
        setOrderPlaced(true);
      }
    } catch (error) {
      console.error('Error submitting order:', error.message);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div>
      <h1>Place Your Order</h1>
      {!orderPlaced ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="item">Item Details:</label>
            <input
              type="text"
              id="item"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="location">Location (GPS Coordinates):</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <button type="submit">Place Order</button>
        </form>
      ) : (
        <OtpVerification />
      )}
    </div>
  );
}

export default OrderPage;