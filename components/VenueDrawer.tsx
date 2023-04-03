import { useState, useEffect, FormEvent, SyntheticEvent } from "react";
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
} from "@chakra-ui/react";
import { useGlobalState } from "../context";
import { useVenues } from "../hooks/useVenues";

export default function VenueDrawer() {
  const {
    isVenueDrawerOpen: isOpen,
    setActiveVenueId,
    setIsVenueDrawerOpen,
    activeVenueId: venueId,
  } = useGlobalState();
  const {
    isLoading,
    loadingVenue,
    fetchVenue,
    venueData,
    setVenueData,
    addVenue,
    updateVenue,
  } = useVenues();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!venueId) {
      //add venue
      await addVenue();
      onClose();
    } else {
      //update venue
      await updateVenue();
      onClose();
    }
  }

  function onClose() {
    setActiveVenueId(null);
    setIsVenueDrawerOpen(false);
  }

  function updateVenueState(e: SyntheticEvent) {
    const input = e.target as HTMLInputElement;
    setVenueData({ ...venueData, [input.name]: input.value });
  }

  useEffect(() => {
    if (venueId) {
      fetchVenue(venueId);
    } else {
      setVenueData({
        title: "",
      });
    }
  }, [venueId]);

  return (
    <>
      <Drawer isOpen={isOpen} size="md" placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {venueId ? "Update Venue" : "Add new Venue"}
          </DrawerHeader>
          {loadingVenue ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <form onSubmit={handleSubmit}>
              <DrawerBody>
                <FormControl mb="10px">
                  <FormLabel>Title</FormLabel>
                  <InputGroup>
                    <Input
                      required
                      name="title"
                      type="text"
                      placeholder="Title"
                      onInput={updateVenueState}
                      value={venueData?.title || ""}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mb="10px">
                  <FormLabel>Website</FormLabel>
                  <InputGroup>
                    <Input
                      name="website"
                      type="text"
                      placeholder="www.website.com"
                      onInput={updateVenueState}
                      value={venueData?.website || ""}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mb="10px">
                  <FormLabel>Phone</FormLabel>
                  <InputGroup>
                    <Input
                      name="phone"
                      type="text"
                      placeholder="000 000 000"
                      onInput={updateVenueState}
                      value={venueData?.phone || ""}
                    />
                  </InputGroup>
                </FormControl>
              </DrawerBody>

              <DrawerFooter>
                <Center w="full">
                  <Button variant="outline" mr={3} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
                  >
                    Save
                  </Button>
                </Center>
              </DrawerFooter>
            </form>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
