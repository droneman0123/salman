import { supabase } from './supabase';

export const createOrder = async (orderData) => {
  const { user } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

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
        address_id: orderData.address_id
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserOrders = async () => {
  const { user } = await supabase.auth.getUser();
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
