import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase';

const OrderStatus = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState('');
  const [orderStatus, setOrderStatus] = useState('pending');

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        setMessage('Error fetching order status');
        return;
      }

      if (data) {
        setOrder(data);
        setOrderStatus(data.status);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An unexpected error occurred');
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const verifyOTP = async () => {
    if (!otp) {
      setMessage('Please enter OTP');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: 'delivered' })
        .eq('id', orderId)
        .eq('otp', otp)
        .select();

      if (error) {
        setMessage('Invalid OTP');
        return;
      }

      if (data && data.length > 0) {
        setOrderStatus('delivered');
        setMessage('Order delivered successfully!');
      } else {
        setMessage('Invalid OTP');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An unexpected error occurred');
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <button onClick={onBack} className="mb-4 text-blue-500">
        ← Back to Orders
      </button>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Order Status</h2>
        
        <div className="mb-4">
          <p>Order ID: {orderId}</p>
          <p>Status: {orderStatus}</p>
          <p>Total Amount: ₹{order.price}</p>
        </div>

        {orderStatus === 'out_for_delivery' && (
          <div className="mb-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="border p-2 rounded mr-2"
            />
            <button
              onClick={verifyOTP}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Verify OTP
            </button>
          </div>
        )}

        {message && (
          <div className={`mt-4 p-2 rounded ${
            message.includes('Error') || message.includes('Invalid')
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;