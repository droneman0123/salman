import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase';

const OrderStatus = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (orderId) {
      console.log('Setting up subscription for order:', orderId);
      
      const subscription = supabase
        .channel(`orders:id=eq.${orderId}`)
        .on('UPDATE', payload => {
          console.log('Order update received:', payload);
          setOrder(payload.new);
        })
        .subscribe(status => {
          console.log('Subscription status:', status);
        });

      fetchOrder();

      return () => {
        console.log('Cleaning up subscription');
        supabase.removeSubscription(subscription);
      };
    }
  }, [orderId]);

  const fetchOrder = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        return;
      }

      if (data) {
        setOrder(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const verifyOTP = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('otp', otp)
      .single();

    if (error || !data) {
      setMessage('Invalid OTP');
    } else {
      setMessage('OTP verified successfully!');
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Order Status</h2>
        <button 
          onClick={onBack}
          className="text-blue-500 hover:text-blue-700 text-sm sm:text-base"
        >
          ← Back
        </button>
      </div>
      <div className="space-y-2 mb-4">
        <p className="text-sm sm:text-base">
          Status: <span className="font-bold">{order.status}</span>
        </p>
        <p className="text-sm sm:text-base">
          Item: <span className="font-medium">{order.item}</span>
        </p>
      </div>
      
      {order.status === 'in-transit' && (
        <div className="space-y-2">
          <label className="block text-gray-700 text-sm font-medium mb-1">Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 text-base border rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter OTP"
          />
          <button
            onClick={verifyOTP}
            className="w-full py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 rounded transition duration-200"
          >
            Verify OTP
          </button>
        </div>
      )}
      
      {message && (
        <div className="mt-4 p-3 text-sm text-center rounded bg-gray-50">
          {message}
        </div>
      )}
    </div>
  );
};

export default OrderStatus; 