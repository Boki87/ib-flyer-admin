import { createContext, useContext, ReactNode, useState } from "react";
import { Owner } from "../types/Owner";
import { NFC } from "../types/NFC";
import { Venue } from "../types/Venue";

interface IGloablContext {
  owners: Owner[];
  setOwners: (arr: Owner[]) => void;
  loadingOwners: boolean;
  setLoadingOwners: (val: boolean) => void;
  isOwnerDrawerOpen: boolean;
  setIsOwnerDrawerOpen: (val: boolean) => void;
  activeOwnerId: string | null;
  setActiveOwnerId: (val: string | null) => void;

  ownerData: Owner | null;
  setOwnerData: (val: Owner) => void;

  venues: Venue[];
  setVenues: (arr: Venue[]) => void;
  isVenueDrawerOpen: boolean;
  setIsVenueDrawerOpen: (val: boolean) => void;
  activeVenueId: string | null;
  setActiveVenueId: (val: string | null) => void;

  nfcs: NFC[];
  setNfcs: (arr: NFC[]) => void;
}

const initialState: IGloablContext = {
  owners: [],
  setOwners: () => {},
  loadingOwners: false,
  setLoadingOwners: () => {},
  isOwnerDrawerOpen: false,
  setIsOwnerDrawerOpen: () => {},
  activeOwnerId: null,
  setActiveOwnerId: () => {},
  ownerData: null,
  setOwnerData: () => {},
  venues: [],
  setVenues: () => {},
  isVenueDrawerOpen: false,
  setIsVenueDrawerOpen: () => {},
  activeVenueId: null,
  setActiveVenueId: () => {},
  nfcs: [],
  setNfcs: () => {},
};

const globalContext = createContext(initialState);
export const useGlobalState = () => useContext(globalContext);

export default function CombinedContext({ children }: { children: ReactNode }) {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [isOwnerDrawerOpen, setIsOwnerDrawerOpen] = useState(false);
  const [activeOwnerId, setActiveOwnerId] = useState<string | null>(null);

  const [ownerData, setOwnerData] = useState<Owner | null>(null);

  const [venues, setVenues] = useState<Venue[]>([]);
  const [isVenueDrawerOpen, setIsVenueDrawerOpen] = useState(false);
  const [activeVenueId, setActiveVenueId] = useState<string | null>(null);

  const [nfcs, setNfcs] = useState<NFC[]>([]);

  return (
    <globalContext.Provider
      value={{
        owners,
        setOwners,
        loadingOwners,
        setLoadingOwners,
        isOwnerDrawerOpen,
        setIsOwnerDrawerOpen,
        activeOwnerId,
        setActiveOwnerId,
        ownerData,
        setOwnerData,
        venues,
        setVenues,
        activeVenueId,
        setActiveVenueId,
        isVenueDrawerOpen,
        setIsVenueDrawerOpen,
        nfcs,
        setNfcs,
      }}
    >
      {children}
    </globalContext.Provider>
  );
}
