import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import { useGlobalState } from "../context";

export function useOwner() {
  const initialOwnerData = {
    email: "",
    full_name: "",
    company_name: "",
    phone: "",
  };

  const [ownerData, setOwnerData] = useState(initialOwnerData);
  const [isLoading, setIsLoading] = useState(false);
  const {
    setOwners,
    owners,
    activeOwnerId: ownerId,
    isOwnerDrawerOpen: isOpen,
    setLoadingOwners,
  } = useGlobalState();

  async function addNewOwner() {
    //add new owner
    try {
      setIsLoading(true);
      //signup new user
      const { data, error } = await supabase.auth.signUp({
        email: ownerData.email,
        password: "1234567",
      });

      if (error) throw Error(error.message);
      if (!data.user) throw Error("Error creating user");
      //add entry to owners table with the new user data
      const newOwner = {
        ...ownerData,
        user_id: data.user.id,
        id: data.user.id,
      };
      const { data: ownerDbData, error: ownerError } = await supabase
        .from("owners")
        .insert([newOwner]);
      if (ownerError) throw Error(ownerError.message);

      //create dummy venue/property
      const dummyVenue = {
        owner_id: data.user.id,
        title: "My Property",
        description: "Change me",
      };
      const { data: venueData, error: venueError } = await supabase
        .from("venues")
        .insert([dummyVenue]);
      if (venueError) throw Error(venueError.message);

      setOwners([...owners, newOwner]);

      setIsLoading(false);
      //   onClose();
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  }

  async function updateOwner() {
    try {
      setIsLoading(true);
      const { email, ...restOwnerData } = ownerData;
      const { data, error } = await supabase
        .from("owners")
        .update(restOwnerData)
        .match({ id: ownerId });

      if (error) throw Error(error.message);
      const newOwnersData = owners.map((owner) => {
        if (owner.id === ownerId) {
          return {
            ...owner,
            ...restOwnerData,
          };
        } else {
          return owner;
        }
      });
      setOwners(newOwnersData);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  }

  async function fetchOwnerData() {
    try {
      setLoadingOwners(true);
      const { data, error } = await supabase
        .from("owners")
        .select("email, full_name, company_name, phone")
        .eq("id", ownerId?.toString())
        .single();
      if (error) throw Error(error.message);

      setLoadingOwners(false);
      setOwnerData(data);
    } catch (e) {
      console.log(e);
      setLoadingOwners(false);
    }
  }

  useEffect(() => {
    if (ownerId) {
      fetchOwnerData();
    } else {
      setOwnerData(initialOwnerData);
    }

    if (!isOpen) {
      setOwnerData(initialOwnerData);
    }
  }, [ownerId, isOpen]);

  return {
    addNewOwner,
    updateOwner,
    ownerData,
    setOwnerData,
    isLoading,
  };
}
