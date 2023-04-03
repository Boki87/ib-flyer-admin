import {
  Center,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  FormControl,
  Input,
  InputGroup,
  FormLabel,
  Spinner,
  Select,
} from "@chakra-ui/react";
import { SyntheticEvent, useEffect, useState } from "react";
import supabase from "../lib/supabase";
import { Venue } from "../types/Venue";
import { useRouter } from "next/router";
import { DeviceType } from "../types/DeviceType";
import { NFC } from "../types/NFC";

interface INfcDrawer {
  isOpen: boolean;
  activeNfcId: string | null;
  onClose?: () => void;
  onUpdate?: (nfc: NFC) => void;
}

type NFCData = {
  title: string;
  device_type_id: number;
  is_active: boolean;
  venue_id: string;
  owner_id: string;
};

export default function NfcDrawer({
  isOpen,
  activeNfcId,
  onClose,
  onUpdate,
}: INfcDrawer) {
  const isNewNfc = activeNfcId === "new";
  const [venues, setVenues] = useState<Venue[]>([]);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [nfcData, setNfcData] = useState<NFCData>({
    title: "",
    device_type_id: 1,
    is_active: true,
    venue_id: "",
    owner_id: "",
  });

  const router = useRouter();

  async function fetchNfcData(id: string) {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("nfcs")
      .select("*")
      .match({ id })
      .single();
    setIsLoading(false);
    if (!error) {
      setNfcData({
        title: data.title,
        device_type_id: data.device_type_id,
        is_active: data.is_active,
        venue_id: data.venue_id,
        owner_id: data.owner_id,
      });
    } else {
      resetForm();
    }
  }

  async function fetchVenues() {
    const { data: venueData, error: venueError } = await supabase
      .from("venues")
      .select()
      .match({ owner_id: router.query.id });
    if (!venueError) {
      setVenues(venueData);
      if (venueData.length > 0) {
        setNfcData((old) => ({ ...old, venue_id: venueData[0].id }));
      }
    }
  }

  async function fetchDeviceTypes() {
    const { data: deviceTypesData, error: deviceTypeError } = await supabase
      .from("device_types")
      .select();
    if (!deviceTypeError) {
      setDeviceTypes(deviceTypesData);
    }
  }

  function updateNfcDataState(e: SyntheticEvent) {
    let { value, name } = e.target as HTMLInputElement;
    setNfcData((old) => {
      return { ...old, [name]: value };
    });
  }

  function resetForm() {
    const owner_id = (router.query.id as string) || "";
    setNfcData({
      title: "",
      device_type_id: 1,
      is_active: true,
      venue_id: "",
      owner_id,
    });
  }

  async function submitHandler(e: SyntheticEvent) {
    setIsUpdating(true);
    e.preventDefault();
    if (isNewNfc) {
      const { data, error } = await supabase
        .from("nfcs")
        .insert([{ ...nfcData }])
        .select(
          `*, 
          device_types (type, image, title),
          venues (title, logo) 
        `
        )
        .single();
      onUpdate && onUpdate(data);
    } else {
      const { data, error } = await supabase
        .from("nfcs")
        .update({ ...nfcData })
        .match({ id: activeNfcId })
        .select(
          `*, 
          device_types (type, image, title),
          venues (title, logo) 
        `
        )
        .single();
      onUpdate && onUpdate(data);
    }
    setIsUpdating(false);
  }

  useEffect(() => {
    fetchDeviceTypes();
    fetchVenues();
    if (activeNfcId !== "new" && activeNfcId) {
      fetchNfcData(activeNfcId);
    } else {
      resetForm();
    }
  }, [activeNfcId]);

  return (
    <>
      <Drawer
        isOpen={isOpen}
        size="md"
        placement="right"
        onClose={() => onClose && onClose()}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{isNewNfc ? "Add new NFC" : "Update NFC"}</DrawerHeader>
          <form onSubmit={submitHandler}>
            <DrawerBody>
              {isLoading ? (
                <Center>
                  <Spinner />
                </Center>
              ) : (
                <>
                  <FormControl mb="10px">
                    <FormLabel>Title</FormLabel>
                    <InputGroup>
                      <Input
                        name="title"
                        type="text"
                        required
                        placeholder="NFC title"
                        onInput={updateNfcDataState}
                        value={nfcData.title}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl mb="10px">
                    <FormLabel>Venue:</FormLabel>
                    <InputGroup>
                      <Select
                        value={nfcData.venue_id}
                        onChange={(e: SyntheticEvent) => {
                          let select = e.target as HTMLSelectElement;
                          setNfcData((old) => {
                            return { ...old, venue_id: select.value };
                          });
                        }}
                      >
                        {venues.map((venue) => {
                          return (
                            <option value={venue.id} key={venue.id}>
                              {venue.title}
                            </option>
                          );
                        })}
                      </Select>
                    </InputGroup>
                  </FormControl>
                  <FormControl mb="10px">
                    <FormLabel>NFC type:</FormLabel>
                    <InputGroup>
                      <Select
                        value={nfcData.device_type_id}
                        onChange={(e: SyntheticEvent) => {
                          let select = e.target as HTMLSelectElement;
                          setNfcData((old) => {
                            return {
                              ...old,
                              device_type_id: parseInt(select.value),
                            };
                          });
                        }}
                      >
                        {deviceTypes.map((deviceType) => {
                          return (
                            <option value={deviceType.id} key={deviceType.id}>
                              {deviceType.title}
                            </option>
                          );
                        })}
                      </Select>
                    </InputGroup>
                  </FormControl>
                </>
              )}
            </DrawerBody>
            <DrawerFooter>
              <Center w="full">
                <Button variant="outline" mr={3} onClick={onClose}>
                  {isNewNfc ? "Cancel" : "Close"}
                </Button>
                <Button type="submit" colorScheme="blue" isLoading={isUpdating}>
                  {isNewNfc ? "Add" : "Save"}
                </Button>
              </Center>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
}
