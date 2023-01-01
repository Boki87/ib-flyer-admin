import { useState, useEffect, FormEvent, SyntheticEvent } from "react";
import {
  Image,
  VStack,
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
import { useDeviceTypes } from "../hooks/useDeviceTypes";
import { AiOutlineUpload } from "react-icons/ai";

export default function DeviceTypeDrawer() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  const {
    loadingDeviceTypes: isLoading,
    loadingDeviceType: isLoadingDevice,
    deviceTypeData: deviceData,
    isDeviceTypeDrawerOpen: isOpen,
    setIsDeviceTypeDrawerOpen,
    activeDeviceTypeId,
    setActiveDeviceTypeId,
    setDeviceTypeData,
    updateDeviceTypeData,
    uploadImage,
    addNewDeviceTypeData,
  } = useDeviceTypes();

  function onClose() {
    setIsDeviceTypeDrawerOpen(false);
    setActiveDeviceTypeId(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsUpdating(true);
    if (activeDeviceTypeId) {
      if (file) {
        await uploadImage(
          file,
          deviceData.id?.toString() || (+new Date()).toString()
        );
      }
    } else {
      await addNewDeviceTypeData(deviceData, file || undefined);
    }
    setIsUpdating(false);
  }

  async function updateDeviceState(e: SyntheticEvent) {
    let input = e.target as HTMLInputElement;
    const newData = {
      ...deviceData,
      [input.name]: input.value,
    };
    setDeviceTypeData(newData);
  }

  const setFileHandler = (e: SyntheticEvent) => {
    let input = e.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      setFile(null);
      return;
    }

    let f = input.files[0];

    setFile(f);
  };

  useEffect(() => {
    if (file) {
      let image = URL.createObjectURL(file);
      setPreviewImage(image);
    } else if (deviceData.image) {
      setPreviewImage(deviceData.image + "?" + +new Date());
    }
  }, [file, deviceData.image]);

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPreviewImage("");
    }
  }, [isOpen]);

  return (
    <>
      <Drawer isOpen={isOpen} size="md" placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {activeDeviceTypeId ? `Update Device` : `Create new Device`}
          </DrawerHeader>
          {isLoadingDevice ? (
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
                      placeholder="Device title"
                      onInput={updateDeviceState}
                      value={deviceData.title}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mb="10px">
                  <FormLabel>Price</FormLabel>
                  <InputGroup>
                    <Input
                      required
                      name="price"
                      type="number"
                      placeholder="100"
                      onInput={updateDeviceState}
                      value={deviceData.price}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl mb="10px">
                  <FormLabel>Type</FormLabel>
                  <InputGroup>
                    <Select>
                      <option>Card</option>
                    </Select>
                  </InputGroup>
                </FormControl>
                <VStack>
                  <Image
                    src={previewImage}
                    fallback={<div>Select an image to upload</div>}
                    alt="device image"
                  />
                  <Button
                    as="label"
                    htmlFor="fileInput"
                    rightIcon={<AiOutlineUpload />}
                  >
                    Choose
                  </Button>
                  <input
                    type="file"
                    name="fileInput"
                    id="fileInput"
                    style={{ display: "none", position: "absolute" }}
                    accept="image/*"
                    onChange={setFileHandler}
                  />
                </VStack>
              </DrawerBody>

              <DrawerFooter>
                <Center w="full">
                  <Button variant="outline" mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isUpdating}
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
