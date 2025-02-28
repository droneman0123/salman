import { supabase } from './supabase';

export const createOrder = async (orderData) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        user_id: user.id,
        product_id: orderData.product_id,
        item: orderData.item,
        price: orderData.price,
        status: 'pending',
        delivery_address: orderData.delivery_address,
        location: orderData.location,
        otp: otp
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    throw new Error(error.message);
  }
  return data;
};

export const getUserOrders = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      products (
        name,
        description,
        image,
        price
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getOrderById = async (orderId) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      products (
        name,
        description,
        image,
        price
      )
    `)
    .eq('id', orderId)
    .single();

  if (error) throw error;
  return data;
};
