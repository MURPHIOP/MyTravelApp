'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ITINERARY as DEFAULT_ITINERARY, 
  TRAINS as DEFAULT_TRAINS, 
  HOTELS as DEFAULT_HOTELS, 
  PLACES as DEFAULT_PLACES,
  TRIP_CONFIG
} from '@/lib/tripData';
import { resolveDestinationVisuals } from '@/lib/destinationImageService';

export interface Trip {
  id: string;
  slug: string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  cover_image?: string;
  accent_color?: string;
  is_active: boolean;
  itinerary?: typeof DEFAULT_ITINERARY;
  trains?: typeof DEFAULT_TRAINS;
  hotels?: typeof DEFAULT_HOTELS;
  places?: typeof DEFAULT_PLACES;
  families?: typeof TRIP_CONFIG.families;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_TRIP: Trip = {
  id: 'maharashtra-2026-default',
  slug: 'maharashtra-2026',
  title: 'Ancient Maharashtra Tour',
  description: 'A sacred 10-day journey across Ellora, Ajanta, Shirdi, and Jyotirlingas.',
  start_date: '2026-10-16',
  end_date: '2026-10-26',
  cover_image: '/destinations/hero_map.jpg',
  accent_color: '#2563EB',
  is_active: true,
  itinerary: DEFAULT_ITINERARY,
  trains: DEFAULT_TRAINS,
  hotels: DEFAULT_HOTELS,
  places: DEFAULT_PLACES,
  families: TRIP_CONFIG.families,
};

type TripContextType = {
  trips: Trip[];
  activeTrip: Trip;
  activeTripId: string;
  isLoading: boolean;
  switchActiveTrip: (tripId: string) => Promise<void>;
  createTrip: (payload: Partial<Trip>) => Promise<Trip | null>;
  updateActiveTrip: (updates: Partial<Trip>) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
  refreshTrips: () => Promise<void>;
};

const TripContext = createContext<TripContextType | undefined>(undefined);

const LOCAL_STORAGE_ACTIVE_TRIP = 'mytravelapp_active_trip_id';
const LOCAL_STORAGE_CUSTOM_TRIPS = 'mytravelapp_custom_trips';

function mapTripRows(rows: Record<string, unknown>[]): Trip[] {
  return rows.map((row: Record<string, unknown>) => ({
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    description: row.description ? String(row.description) : undefined,
    start_date: row.start_date ? String(row.start_date) : undefined,
    end_date: row.end_date ? String(row.end_date) : undefined,
    cover_image: row.cover_image ? String(row.cover_image) : undefined,
    accent_color: row.accent_color ? String(row.accent_color) : '#2563EB',
    is_active: Boolean(row.is_active),
    itinerary: Array.isArray(row.itinerary) && row.itinerary.length > 0 ? (row.itinerary as typeof DEFAULT_ITINERARY) : DEFAULT_ITINERARY,
    trains: Array.isArray(row.trains) && row.trains.length > 0 ? (row.trains as typeof DEFAULT_TRAINS) : DEFAULT_TRAINS,
    hotels: Array.isArray(row.hotels) && row.hotels.length > 0 ? (row.hotels as typeof DEFAULT_HOTELS) : DEFAULT_HOTELS,
    places: Array.isArray(row.places) && row.places.length > 0 ? (row.places as typeof DEFAULT_PLACES) : DEFAULT_PLACES,
    metadata: (row.metadata as Record<string, unknown>) || {},
    created_at: row.created_at ? String(row.created_at) : undefined,
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  }));
}

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([DEFAULT_TRIP]);
  const [activeTripId, setActiveTripId] = useState<string>(DEFAULT_TRIP.id);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial load inside effect
  useEffect(() => {
    let ignore = false;

    async function loadTrips() {
      try {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .order('created_at', { ascending: false });

        if (ignore) return;
        if (error) throw error;

        if (data && data.length > 0) {
          const mappedTrips = mapTripRows(data as unknown as Record<string, unknown>[]);
          setTrips(mappedTrips);

          const savedId = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_ACTIVE_TRIP) : null;
          const activeOne = mappedTrips.find(t => t.id === savedId) || mappedTrips.find(t => t.is_active) || mappedTrips[0];
          if (activeOne) {
            setActiveTripId(activeOne.id);
          }
        }
      } catch {
        if (ignore) return;
        if (typeof window !== 'undefined') {
          const storedCustom = localStorage.getItem(LOCAL_STORAGE_CUSTOM_TRIPS);
          const savedId = localStorage.getItem(LOCAL_STORAGE_ACTIVE_TRIP);
          let combined = [DEFAULT_TRIP];
          if (storedCustom) {
            try {
              const parsed = JSON.parse(storedCustom) as Trip[];
              combined = [DEFAULT_TRIP, ...parsed.filter(p => p.id !== DEFAULT_TRIP.id)];
            } catch {
              // ignore
            }
          }
          setTrips(combined);
          if (savedId && combined.some(t => t.id === savedId)) {
            setActiveTripId(savedId);
          }
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadTrips();

    return () => {
      ignore = true;
    };
  }, []);

  // Manual refresh callback
  const refreshTrips = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const mappedTrips = mapTripRows(data as unknown as Record<string, unknown>[]);
        setTrips(mappedTrips);
      }
    } catch {
      // Local fallback
    }
  }, []);

  // Current active trip reference
  const activeTrip = trips.find(t => t.id === activeTripId) || trips[0] || DEFAULT_TRIP;

  // Switch Active Trip
  const switchActiveTrip = async (tripId: string) => {
    const target = trips.find(t => t.id === tripId);
    if (!target) return;

    setActiveTripId(tripId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_TRIP, tripId);
    }

    try {
      await supabase.from('trips').update({ is_active: false }).neq('id', tripId);
      await supabase.from('trips').update({ is_active: true }).eq('id', tripId);
    } catch {
      // Local fallback
    }
  };

  // Create a New Trip with Automated Dynamic Destination Visuals
  const createTrip = async (payload: Partial<Trip>): Promise<Trip | null> => {
    const slug = payload.slug || `trip-${Date.now()}`;
    const tripTitle = payload.title || 'Untitled Journey';
    const visual = resolveDestinationVisuals(tripTitle);

    const newTrip: Trip = {
      id: payload.id || `trip-${Date.now()}`,
      slug,
      title: tripTitle,
      description: payload.description || `${visual.themeCategory} Plan`,
      start_date: payload.start_date || new Date().toISOString().split('T')[0],
      end_date: payload.end_date || new Date().toISOString().split('T')[0],
      cover_image: payload.cover_image || visual.coverImage,
      accent_color: payload.accent_color || visual.accentColor,
      is_active: false,
      itinerary: payload.itinerary || DEFAULT_ITINERARY,
      trains: payload.trains || DEFAULT_TRAINS,
      hotels: payload.hotels || DEFAULT_HOTELS,
      places: payload.places || DEFAULT_PLACES,
      metadata: {
        themeCategory: visual.themeCategory,
        heroImage: visual.heroImage,
        ...(payload.metadata || {}),
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('trips')
        .insert([{
          slug: newTrip.slug,
          title: newTrip.title,
          description: newTrip.description,
          start_date: newTrip.start_date,
          end_date: newTrip.end_date,
          cover_image: newTrip.cover_image,
          accent_color: newTrip.accent_color,
          is_active: newTrip.is_active,
          itinerary: newTrip.itinerary,
          trains: newTrip.trains,
          hotels: newTrip.hotels,
          places: newTrip.places,
          metadata: newTrip.metadata,
        }])
        .select()
        .single();

      if (!error && data) {
        newTrip.id = String(data.id);
      }
    } catch {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(LOCAL_STORAGE_CUSTOM_TRIPS);
        const customTrips: Trip[] = stored ? JSON.parse(stored) : [];
        customTrips.push(newTrip);
        localStorage.setItem(LOCAL_STORAGE_CUSTOM_TRIPS, JSON.stringify(customTrips));
      }
    }

    setTrips(prev => [newTrip, ...prev]);
    return newTrip;
  };

  // Update Active Trip
  const updateActiveTrip = async (updates: Partial<Trip>) => {
    const updated = {
      ...activeTrip,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    setTrips(prev => prev.map(t => (t.id === activeTripId ? updated : t)));

    try {
      await supabase
        .from('trips')
        .update({
          title: updated.title,
          description: updated.description,
          start_date: updated.start_date,
          end_date: updated.end_date,
          cover_image: updated.cover_image,
          accent_color: updated.accent_color,
          itinerary: updated.itinerary,
          trains: updated.trains,
          hotels: updated.hotels,
          places: updated.places,
          metadata: updated.metadata,
          updated_at: updated.updated_at,
        })
        .eq('id', activeTripId);
    } catch {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(LOCAL_STORAGE_CUSTOM_TRIPS);
        if (stored) {
          const customTrips: Trip[] = JSON.parse(stored);
          const idx = customTrips.findIndex(t => t.id === activeTripId);
          if (idx !== -1) {
            customTrips[idx] = updated;
            localStorage.setItem(LOCAL_STORAGE_CUSTOM_TRIPS, JSON.stringify(customTrips));
          }
        }
      }
    }
  };

  // Delete Trip
  const deleteTrip = async (tripId: string) => {
    if (tripId === DEFAULT_TRIP.id || tripId === activeTripId) {
      return;
    }

    setTrips(prev => prev.filter(t => t.id !== tripId));

    try {
      await supabase.from('trips').delete().eq('id', tripId);
    } catch {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(LOCAL_STORAGE_CUSTOM_TRIPS);
        if (stored) {
          const customTrips: Trip[] = JSON.parse(stored);
          const filtered = customTrips.filter(t => t.id !== tripId);
          localStorage.setItem(LOCAL_STORAGE_CUSTOM_TRIPS, JSON.stringify(filtered));
        }
      }
    }
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        activeTripId,
        isLoading,
        switchActiveTrip,
        createTrip,
        updateActiveTrip,
        deleteTrip,
        refreshTrips,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}
