'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  TRIP_CONFIG, 
  PLACE_IMAGES, 
  ITINERARY as DEFAULT_ITINERARY, 
  TRAINS as DEFAULT_TRAINS, 
  HOTELS as DEFAULT_HOTELS, 
  PLACES as DEFAULT_PLACES,
  EXPENSE_CATEGORIES
} from '@/lib/tripData';

import { supabase } from '@/lib/supabase';

type TripContextType = {
  itinerary: typeof DEFAULT_ITINERARY;
  setItinerary: (data: typeof DEFAULT_ITINERARY) => void;
  trains: typeof DEFAULT_TRAINS;
  setTrains: (data: typeof DEFAULT_TRAINS) => void;
  hotels: typeof DEFAULT_HOTELS;
  setHotels: (data: typeof DEFAULT_HOTELS) => void;
  places: typeof DEFAULT_PLACES;
  setPlaces: (data: typeof DEFAULT_PLACES) => void;
};

const TripDataContext = createContext<TripContextType | undefined>(undefined);

export function TripDataProvider({ children }: { children: React.ReactNode }) {
  const [itinerary, setItineraryState] = useState(DEFAULT_ITINERARY);
  const [trains, setTrainsState] = useState(DEFAULT_TRAINS);
  const [hotels, setHotelsState] = useState(DEFAULT_HOTELS);
  const [places, setPlacesState] = useState(DEFAULT_PLACES);

  useEffect(() => {
    const fetchAppState = async () => {
      try {
        const { data, error } = await supabase.from('app_state').select('*');
        if (error) throw error;
        
        if (data && data.length > 0) {
          const stateMap: Record<string, any> = {};
          data.forEach(row => {
            stateMap[row.key] = row.value;
          });

          if (stateMap['godmode_itinerary']) setItineraryState(stateMap['godmode_itinerary']);
          if (stateMap['godmode_hotels']) setHotelsState(stateMap['godmode_hotels']);
          if (stateMap['godmode_places']) setPlacesState(stateMap['godmode_places']);

          if (stateMap['godmode_trains']) {
            const parsed = stateMap['godmode_trains'];
            // Merge to ensure new properties like passengers are included
            const mergedTrains = parsed.map((t: any, i: number) => ({ 
              ...DEFAULT_TRAINS[i], 
              ...t, 
              passengers: DEFAULT_TRAINS[i]?.passengers || t.passengers 
            }));
            setTrainsState(mergedTrains);
          }
        }
      } catch (err) {
        console.error('Failed to fetch app state from Supabase:', err);
      }
    };

    fetchAppState();
  }, []);

  const saveToSupabase = async (key: string, value: any) => {
    try {
      await supabase.from('app_state').upsert({ key, value });
    } catch (err) {
      console.error(`Failed to sync ${key} to Supabase:`, err);
    }
  };

  const setItinerary = (data: typeof DEFAULT_ITINERARY) => {
    setItineraryState(data);
    saveToSupabase('godmode_itinerary', data);
  };

  const setTrains = (data: typeof DEFAULT_TRAINS) => {
    setTrainsState(data);
    saveToSupabase('godmode_trains', data);
  };

  const setHotels = (data: typeof DEFAULT_HOTELS) => {
    setHotelsState(data);
    saveToSupabase('godmode_hotels', data);
  };

  const setPlaces = (data: typeof DEFAULT_PLACES) => {
    setPlacesState(data);
    saveToSupabase('godmode_places', data);
  };

  return (
    <TripDataContext.Provider value={{
      itinerary, setItinerary,
      trains, setTrains,
      hotels, setHotels,
      places, setPlaces
    }}>
      {children}
    </TripDataContext.Provider>
  );
}

export function useTripData() {
  const context = useContext(TripDataContext);
  if (!context) {
    throw new Error('useTripData must be used within a TripDataProvider');
  }
  return context;
}
