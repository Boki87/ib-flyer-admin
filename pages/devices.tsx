import {
  Button,
  Text,
  TableContainer,
  Thead,
  Tr,
  Th,
  Td,
  Table,
  Tbody,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import Layout from "../components/Layout";
import { useDeviceTypes } from "../hooks/useDeviceTypes";
import DeviceTypeDrawer from "../components/DeviceTypeDrawer";
import { RiEdit2Line } from "react-icons/ri";
import { FaTrashAlt } from "react-icons/fa";

export default function Devices() {
  const {
    deviceTypes,
    loadingDeviceTypes: isLoading,
    setActiveDeviceTypeId,
    setIsDeviceTypeDrawerOpen,
    deleteDeviceTypeData,
  } = useDeviceTypes(true);

  function deleteHandler(id: number) {
    let r = window.confirm("Sure you want to delete this device");
    if (!r) return;

    deleteDeviceTypeData(id);
  }

  return (
    <>
      <Layout>
        <Text>Edit the list of devices below:</Text>
        <HStack>
          <Spacer />
          <Button
            onClick={() => {
              setIsDeviceTypeDrawerOpen(true);
            }}
            colorScheme="blue"
            size="sm"
          >
            ADD
          </Button>
        </HStack>
        {isLoading ? (
          <Text>Loading ...</Text>
        ) : (
          <TableContainer w="full">
            <Table variant="striped" size="sm" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Type</Th>
                  <Th>Price</Th>
                  <Th>Image</Th>
                  <Th w="100px"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {deviceTypes.map((device) => {
                  return (
                    <Tr key={device.id}>
                      <Td>{device.title}</Td>
                      <Td>{device.type}</Td>
                      <Td>{device.price}</Td>
                      <Td>
                        <img
                          src={`${device.image}${
                            device.image !== "" ? "?" + +new Date() : ""
                          }`}
                          style={{ height: "50px" }}
                        />
                      </Td>
                      <Td>
                        <Button
                          onClick={() => {
                            if (!device || !device.id) return;
                            setActiveDeviceTypeId(device.id);
                            setIsDeviceTypeDrawerOpen(true);
                          }}
                          mr="10px"
                        >
                          <RiEdit2Line />
                        </Button>
                        <Button
                          onClick={() => {
                            if (!device?.id) return;
                            deleteHandler(device.id);
                          }}
                        >
                          <FaTrashAlt />
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Layout>
      <DeviceTypeDrawer />
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
  const { user } = req.session;

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}, sessionOptions);
