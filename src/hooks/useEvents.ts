import { useState, useEffect } from 'react';
import { Event, createEvent, getEvents } from '../lib/api/events';
import { useAuth } from './useAuth';

export function useEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getEvents(user.id);
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (type: string, description: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const newEvent = await createEvent({
        user_id: user.id,
        type,
        description,
      });
      setEvents(prev => [newEvent, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return {
    events,
    loading,
    error,
    addEvent,
    refreshEvents: fetchEvents,
  };
}