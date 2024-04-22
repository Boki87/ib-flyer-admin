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
  Box,
} from "@chakra-ui/react";
import { useGlobalState } from "../context";
import { useOwner } from "../hooks/useOwner";
import supabase from "../lib/supabase";

export default function OwnerDrawer() {
  const [resetingPassword, setResetingPassword] = useState(false);

  const {
    activeOwnerId: ownerId,
    setActiveOwnerId,
    setIsOwnerDrawerOpen,
    isOwnerDrawerOpen: isOpen,
    loadingOwners,
  } = useGlobalState();

  const { ownerData, addNewOwner, updateOwner, setOwnerData, isLoading } =
    useOwner();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ownerId) {
      await addNewOwner();
      onClose();
    } else {
      await updateOwner();
      onClose();
    }
  }

  function onClose() {
    setActiveOwnerId(null);
    setIsOwnerDrawerOpen(false);
  }

  function updateOwnerState(e: SyntheticEvent) {
    const input = e.target as HTMLInputElement;
    setOwnerData({ ...ownerData, [input.name]: input.value });
  }

  async function resetPassowrdHandler() {
    setResetingPassword(true);
    try {
      await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: ownerId }),
      });
    } catch (e) {
      console.log(e);
      setResetingPassword(false);
    } finally {
      setResetingPassword(false);
    }
  }

  return (
    <>
      <Drawer isOpen={isOpen} size="md" placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {ownerId ? "Update Owner" : "Add new Owner"}
          </DrawerHeader>
          {loadingOwners ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <form onSubmit={handleSubmit}>
              <DrawerBody>
                <FormControl mb="10px">
                  <FormLabel>Email</FormLabel>
                  <InputGroup>
                    <Input
                      required
                      name="email"
                      type="email"
                      placeholder="email address"
                      disabled={!!ownerId}
                      onInput={updateOwnerState}
                      value={ownerData.email || ""}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mb="10px">
                  <FormLabel>Full Name</FormLabel>
                  <InputGroup>
                    <Input
                      name="full_name"
                      type="text"
                      placeholder="John Doe"
                      onInput={updateOwnerState}
                      value={ownerData.full_name || ""}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mb="10px">
                  <FormLabel>Company Name</FormLabel>
                  <InputGroup>
                    <Input
                      name="company_name"
                      type="text"
                      placeholder="Company Ltd"
                      onInput={updateOwnerState}
                      value={ownerData.company_name || ""}
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
                      onInput={updateOwnerState}
                      value={ownerData.phone || ""}
                    />
                  </InputGroup>
                </FormControl>

                <Box>
                  <Button
                    onClick={resetPassowrdHandler}
                    isLoading={resetingPassword}
                  >
                    RESET PASSWORD
                  </Button>
                </Box>
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
