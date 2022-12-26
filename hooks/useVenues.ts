import { useState, useEffect } from "react";
import supabase from "../lib/supabase";
import { useGlobalState } from "../context";
import { Venue } from "../types/Venue";

const venueInitialData = {
  website: "",
  title: "",
  description: "",
  phone: "",
};

export function useVenues(userId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingVenue, setLoadingVenue] = useState(false);
  const [venueData, setVenueData] = useState<Venue>(venueInitialData);

  const { setOwnerData, ownerData, venues, setVenues, activeVenueId } =
    useGlobalState();

  async function fetchOwner(id: string) {
    try {
      setIsLoading(true);

      //fetch owner
      const { data: owner, error } = await supabase
        .from("owners")
        .select()
        .match({ user_id: id })
        .single();
      if (error) throw Error(error.message);
      setOwnerData(owner);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }

  async function fetchVenues(userId: string) {
    try {
      setIsLoading(true);
      //fech venues
      const { data: venuesData, error: venueError } = await supabase
        .from("venues")
        .select()
        .match({ owner_id: userId });
      if (venueError) throw Error(venueError.message);
      setVenues(venuesData);

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  }

  async function fetchVenue(id: string) {
    try {
      const { data, error } = await supabase
        .from("venues")
        .select()
        .match({ id })
        .single();
      setVenueData(data);
    } catch (e) {
      console.log(e);
    }
  }

  async function addVenue() {
    if (!ownerData) return;
    try {
      const newVenue = {
        ...venueData,
        owner_id: ownerData.user_id,
      };
      const { data, error } = await supabase
        .from("venues")
        .insert([newVenue])
        .select()
        .single();

      if (error) throw Error(error.message);
      const newVenues = [...venues, data];
      setVenues(newVenues);
    } catch (e) {
      console.log(e);
    }
  }

  async function updateVenue() {
    if (!activeVenueId) return;
    try {
      const { error } = await supabase
        .from("venues")
        .update(venueData)
        .match({ id: activeVenueId });

      if (error) throw Error(error.message);

      const newVenues = venues.map((venue) => {
        if (venue.id === activeVenueId) {
          return venueData;
        } else {
          return venue;
        }
      });

      setVenues(newVenues);
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteVenue(id: string) {
    try {
      const { error } = await supabase.from("venues").delete().eq("id", id);
      if (error) throw Error(error.message);
      const newVenues = venues.filter((venue) => venue.id !== id);
      setVenues(newVenues);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (!userId) return;
    fetchOwner(userId);
    fetchVenues(userId);
  }, []);

  return {
    isLoading,
    loadingVenue,
    fetchOwner,
    ownerData,
    venues,
    fetchVenue,
    venueData,
    setVenueData,
    addVenue,
    updateVenue,
    deleteVenue,
  };
}
