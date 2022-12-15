import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import {
  Box,
  Button,
  HStack,
  Text,
  Spacer,
  TableContainer,
  Thead,
  Tr,
  Th,
  Td,
  Table,
  Tbody,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { useGlobalState } from "../../../context";
import supabase from "../../../lib/supabase";
import { BsFillTrashFill, BsArrowUpRight } from "react-icons/bs";

export default function Venues() {
  const router = useRouter();
  const userId = router.query.id;
  const { nfcs, setNfcs } = useGlobalState();
  const [isLoadingData, setIsLoadingData] = useState(false);

  async function fetchData() {
    try {
      setIsLoadingData(true);
      //fetch nfcs
      const { data: nfcData, error: nfcError } = await supabase
        .from("nfcs")
        .select(
          `*, 
            device_types (type, image, title)`
        )
        .match({ owner_id: userId });
      console.log(nfcData);
      if (nfcError) throw Error(nfcError.message);
      setNfcs(nfcData);
      setIsLoadingData(false);
    } catch (e) {
      console.log(e);
      setIsLoadingData(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [userId]);

  return (
    <Layout>
      <HStack>
        <Text>NFC's</Text>
        <Spacer />
        <Button>ADD</Button>
      </HStack>

      <TableContainer w="full">
        <Table variant="striped" size="sm" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Ttile</Th>
              <Th>UUID</Th>
              <Th w="100px"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {nfcs.map((nfc) => (
              <Tr cursor="pointer" key={nfc.id}>
                <Td _hover={{ textDecoration: "underline" }}>
                  {nfc?.device_types?.title}
                </Td>
                <Td>{nfc.id}</Td>
                <Td>
                  <Button colorScheme="blue" mr="10px">
                    <BsArrowUpRight />
                  </Button>
                  <Button colorScheme="red">
                    <BsFillTrashFill />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Layout>
  );
}

export const getServerSideProps = withIronSessionSsr(async ({ req }) => {
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
