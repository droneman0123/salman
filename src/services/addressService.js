import { supabase } from './supabase';

export const saveUserAddress = async (address) => {
  const { user } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_addresses')
    .insert([
      {
        user_id: user.id,
        formatted_address: address.formattedAddress,
        latitude: address.coordinates?.lat,
        longitude: address.coordinates?.lng,
        is_default: true // Make this address the default one
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserAddresses = async () => {
  const { user } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteUserAddress = async (addressId) => {
  const { error } = await supabase
    .from('user_addresses')
    .delete()
    .eq('id', addressId);

  if (error) throw error;
};

export const setDefaultAddress = async (addressId) => {
  const { user } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // First, set all addresses to non-default
  await supabase
    .from('user_addresses')
    .update({ is_default: false })
    .eq('user_id', user.id);

  // Then set the selected address as default
  const { error } = await supabase
    .from('user_addresses')
    .update({ is_default: true })
    .eq('id', addressId);

  if (error) throw error;
};
