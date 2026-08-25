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
    // Load from localStorage on mount
    const storedItinerary = localStorage.getItem('godmode_itinerary');
    if (storedItinerary) setItineraryState(JSON.parse(storedItinerary));

    const storedTrains = localStorage.getItem('godmode_trains');
    if (storedTrains) setTrainsState(JSON.parse(storedTrains));

    const storedHotels = localStorage.getItem('godmode_hotels');
    if (storedHotels) setHotelsState(JSON.parse(storedHotels));
    
    const storedPlaces = localStorage.getItem('godmode_places');
    if (storedPlaces) setPlacesState(JSON.parse(storedPlaces));
  }, []);

  const setItinerary = (data: typeof DEFAULT_ITINERARY) => {
    setItineraryState(data);
    localStorage.setItem('godmode_itinerary', JSON.stringify(data));
  };

  const setTrains = (data: typeof DEFAULT_TRAINS) => {
    setTrainsState(data);
    localStorage.setItem('godmode_trains', JSON.stringify(data));
  };

  const setHotels = (data: typeof DEFAULT_HOTELS) => {
    setHotelsState(data);
    localStorage.setItem('godmode_hotels', JSON.stringify(data));
  };

  const setPlaces = (data: typeof DEFAULT_PLACES) => {
    setPlacesState(data);
    localStorage.setItem('godmode_places', JSON.stringify(data));
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
