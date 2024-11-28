import { supabase } from '../supabase';

export interface UserProfile {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export async function updateUserProfile(userId: string, profile: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}