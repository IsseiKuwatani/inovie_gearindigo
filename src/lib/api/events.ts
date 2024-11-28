import { supabase } from '../supabase';

export interface Event {
  id: string;
  user_id: string;
  type: string;
  description: string;
  created_at: string;
}

export async function createEvent(event: Omit<Event, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getEvents(userId: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}