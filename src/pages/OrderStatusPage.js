import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

function OrderStatusPage() {
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('status')
          .order('id', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          setError(error);
        } else {
          setOrderStatus(data?.status || 'No orders placed yet.');
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, []);

  if (loading) {
    return <div>Loading order status...</div>;
  }

  if (error) {
    return <div>Error fetching order status: {error.message}</div>;
  }

  return (
    <div>
      <h1>Order Status</h1>
      <p>Status: {orderStatus}</p>
      <h2>Order Tracking</h2>
      {/* Dummy map image */}
      <img src="https://via.placeholder.com/300x200" alt="Dummy Map" />
    </div>
  );
}

export default OrderStatusPage;