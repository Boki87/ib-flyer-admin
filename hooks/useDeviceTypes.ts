import { useState, useEffect } from "react";
import supabase from "../lib/supabase";
import { DeviceType } from "../types/DeviceType";
import { useGlobalState } from "../context";

export function useDeviceTypes(loadDevices: boolean = false) {
  const {
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
  } = useGlobalState();

  async function fetchDeviceTypes() {
    try {
      setLoadingDeviceTypes(true);
      const { data, error } = await supabase.from("device_types").select();
      if (error) throw Error(error.message);
      setDeviceTypes(data);
      setLoadingDeviceTypes(false);
    } catch (e) {
      console.log(e);
      setLoadingDeviceTypes(false);
    }
  }

  async function fetchDeviceTypeData(id: number) {
    try {
      setLoadingDeviceType(true);
      const { data, error } = await supabase
        .from("device_types")
        .select()
        .match({ id })
        .single();

      if (error) throw Error(error.message);
      setDeviceTypeData(data);
      setLoadingDeviceType(false);
    } catch (e) {
      console.log(e);
      setLoadingDeviceType(false);
    }
  }

  async function addNewDeviceTypeData(device: DeviceType, image?: File) {
    try {
      const { data, error } = await supabase
        .from("device_types")
        .insert([device])
        .select()
        .single();
      if (error) throw Error(error.message);

      //upload image if any
      let imagePath = "";
      if (image) {
        let ext = image.name.split(".").pop();
        let fullPath = `device_types/${data.id}.${ext}`;
        const { data: imageData, error } = await supabase.storage
          .from("public")
          .upload(fullPath, image, {
            upsert: true,
          });
        if (error) throw Error(error.message);

        const { data: readData } = await supabase.storage
          .from("public")
          .getPublicUrl(fullPath);
        imagePath = readData.publicUrl;
        let newData = { ...data, image: imagePath };
        await updateDeviceTypeData(newData);
        setDeviceTypes([...deviceTypes, newData]);
      } else {
        setDeviceTypes([...deviceTypes, { ...data, image: imagePath }]);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function updateDeviceTypeData(d: DeviceType) {
    var newData = deviceTypeData;
    if (d) {
      newData = d;
    }
    try {
      const { id, ...restDeviceTypeData } = newData;
      const { error } = await supabase
        .from("device_types")
        .update(restDeviceTypeData)
        .match({ id });

      if (error) throw Error(error.message);
      const newDevices = deviceTypes.map((device) => {
        if (device.id === id) {
          return newData;
        } else {
          return device;
        }
      });
      setDeviceTypes(newDevices);
    } catch (e) {
      console.log(e);
    }
  }

  async function uploadImage(image: File, name: string) {
    let ext = image.name.split(".").pop();
    let fullPath = `device_types/${name}.${ext}`;
    try {
      const { data, error } = await supabase.storage
        .from("public")
        .upload(fullPath, image, {
          upsert: true,
        });
      if (error) throw Error(error.message);

      const { data: readData } = await supabase.storage
        .from("public")
        .getPublicUrl(fullPath);

      const newData = {
        ...deviceTypeData,
        image: readData.publicUrl,
      };
      await updateDeviceTypeData(newData);
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteDeviceTypeData(id: number) {
    try {
      const { data, error } = await supabase
        .from("device_types")
        .delete()
        .match({ id });
      if (error) throw Error(error.message);
      const newDevices = deviceTypes.filter((d) => d.id !== id);
      setDeviceTypes(newDevices);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (loadDevices) {
      fetchDeviceTypes();
    }
  }, []);

  useEffect(() => {
    if (isDeviceTypeDrawerOpen && activeDeviceTypeId) {
      fetchDeviceTypeData(activeDeviceTypeId);
    }
    if (!isDeviceTypeDrawerOpen) {
      setDeviceTypeData({
        title: "",
        price: 100,
        type: "Card",
        image: "",
      });
    }
  }, [activeDeviceTypeId, isDeviceTypeDrawerOpen]);

  return {
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
    updateDeviceTypeData,
    uploadImage,
    addNewDeviceTypeData,
    deleteDeviceTypeData,
  };
}
