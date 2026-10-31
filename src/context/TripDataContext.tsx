'use client';

import React, { createContext, useContext } from 'react';
import { 
  ITINERARY as DEFAULT_ITINERARY, 
  TRAINS as DEFAULT_TRAINS, 
  HOTELS as DEFAULT_HOTELS, 
  PLACES as DEFAULT_PLACES
} from '@/lib/tripData';

import { supabase } from '@/lib/supabase';
import { useTrip } from '@/context/TripContext';

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
  const { activeTrip, updateActiveTrip } = useTrip();

  const itinerary = activeTrip?.itinerary && activeTrip.itinerary.length > 0 
    ? activeTrip.itinerary 
    : DEFAULT_ITINERARY;

  const trains = activeTrip?.trains && activeTrip.trains.length > 0 
    ? activeTrip.trains 
    : DEFAULT_TRAINS;

  const hotels = activeTrip?.hotels && activeTrip.hotels.length > 0 
    ? activeTrip.hotels 
    : DEFAULT_HOTELS;

  const places = activeTrip?.places && activeTrip.places.length > 0 
    ? activeTrip.places 
    : DEFAULT_PLACES;

  const saveToSupabase = async (key: string, value: unknown) => {
    try {
      await supabase.from('app_state').upsert({ key, value });
    } catch (err) {
      console.error(`Failed to sync ${key} to Supabase:`, err);
    }
  };

  const setItinerary = (data: typeof DEFAULT_ITINERARY) => {
    saveToSupabase('godmode_itinerary', data);
    updateActiveTrip({ itinerary: data });
  };

  const setTrains = (data: typeof DEFAULT_TRAINS) => {
    saveToSupabase('godmode_trains', data);
    updateActiveTrip({ trains: data });
  };

  const setHotels = (data: typeof DEFAULT_HOTELS) => {
    saveToSupabase('godmode_hotels', data);
    updateActiveTrip({ hotels: data });
  };

  const setPlaces = (data: typeof DEFAULT_PLACES) => {
    saveToSupabase('godmode_places', data);
    updateActiveTrip({ places: data });
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
