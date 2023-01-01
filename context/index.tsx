import { createContext, useContext, ReactNode, useState } from "react";
import { Owner } from "../types/Owner";
import { NFC } from "../types/NFC";
import { Venue } from "../types/Venue";
import { DeviceType } from "../types/DeviceType";

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

  //Device Types
  deviceTypes: DeviceType[];
  setDeviceTypes: (val: DeviceType[]) => void;
  deviceTypeData: DeviceType;
  setDeviceTypeData: (val: DeviceType) => void;
  activeDeviceTypeId: number | null;
  setActiveDeviceTypeId: (val: number | null) => void;
  isDeviceTypeDrawerOpen: boolean;
  setIsDeviceTypeDrawerOpen: (val: boolean) => void;
  loadingDeviceType: boolean;
  setLoadingDeviceType: (val: boolean) => void;
  loadingDeviceTypes: boolean;
  setLoadingDeviceTypes: (val: boolean) => void;
}

const initialDeviceTypeData = {
  title: "",
  price: 100,
  type: "Card",
  image: "",
};

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

  //Device Types
  deviceTypes: [],
  setDeviceTypes: () => {},
  deviceTypeData: initialDeviceTypeData,
  setDeviceTypeData: () => {},
  activeDeviceTypeId: null,
  setActiveDeviceTypeId: () => {},
  isDeviceTypeDrawerOpen: false,
  setIsDeviceTypeDrawerOpen: () => {},
  loadingDeviceType: false,
  setLoadingDeviceType: () => {},
  loadingDeviceTypes: false,
  setLoadingDeviceTypes: () => {},
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

  //Device Types State
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [deviceTypeData, setDeviceTypeData] = useState<DeviceType>(
    initialDeviceTypeData
  );
  const [activeDeviceTypeId, setActiveDeviceTypeId] = useState<number | null>(
    null
  );
  const [isDeviceTypeDrawerOpen, setIsDeviceTypeDrawerOpen] = useState(false);
  const [loadingDeviceType, setLoadingDeviceType] = useState(false);
  const [loadingDeviceTypes, setLoadingDeviceTypes] = useState(false);

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

        deviceTypes,
        setDeviceTypes,
        deviceTypeData,
        setDeviceTypeData,
        activeDeviceTypeId,
        setActiveDeviceTypeId,
        isDeviceTypeDrawerOpen,
        setIsDeviceTypeDrawerOpen,
        loadingDeviceType,
        setLoadingDeviceType,
        loadingDeviceTypes,
        setLoadingDeviceTypes,
      }}
    >
      {children}
    </globalContext.Provider>
  );
}
