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
import { BsFillTrashFill, BsArrowUpRight, BsClipboard } from "react-icons/bs";
import NfcDrawer from "../../../components/NfcDrawer";
import { NFC } from "../../../types/NFC";

export default function Venues() {
  const router = useRouter();
  const userId = router.query.id;
  const { nfcs, setNfcs } = useGlobalState();
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [activeNfcId, setActiveNfcId] = useState<string | null>(null);

  async function fetchData() {
    try {
      setIsLoadingData(true);
      //fetch nfcs
      const { data: nfcData, error: nfcError } = await supabase
        .from("nfcs")
        .select(
          `*, 
            device_types (type, image, title),
            venues (title, logo) 
          `
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

  function updateList(nfc: NFC) {
    console.log(nfc);

    let newNfcs: NFC[] = [];
    if (nfcs.find((n) => n.id === nfc.id)) {
      newNfcs = nfcs.map((n) => {
        if (n.id === nfc.id) {
          return nfc;
        } else {
          return n;
        }
      });
    } else {
      newNfcs = [...nfcs, nfc];
    }

    setNfcs(newNfcs);
  }

  async function deleteNfc(id?: string) {
    if (!id) return;
    if (!window.confirm("Sure you want to delete this nfc?")) return;

    const { data, error } = await supabase.from("nfcs").delete().match({ id });
    if (error) return;

    const newNfcs = nfcs.filter((n) => n.id !== id);
    setNfcs(newNfcs);
  }

  async function copyToClipboard(id?: string) {
    if (!id) return;

    const BASE_URL = `https://tapapp-supabase.vercel.app/d/`;

    try {
      await window.navigator.clipboard.writeText(`${BASE_URL}${id}`);
      window.alert("Link copied to clipboard!");
    } catch (e) {
      window.alert("Could not copy to url, browser does not support");
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
        <Button onClick={() => setActiveNfcId("new")}>ADD</Button>
      </HStack>

      <TableContainer w="full">
        <Table variant="striped" size="sm" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Ttile</Th>
              <Th>Venues</Th>
              <Th w="100px"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {nfcs.map((nfc) => (
              <Tr cursor="pointer" key={nfc.id}>
                <Td _hover={{ textDecoration: "underline" }}>{nfc?.title}</Td>
                <Td>{nfc?.venues?.title}</Td>
                <Td>
                  <Button
                    onClick={() => copyToClipboard(nfc?.id)}
                    colorScheme="blue"
                    mr="10px"
                  >
                    <BsClipboard />
                  </Button>
                  <Button
                    onClick={() => setActiveNfcId(nfc?.id || null)}
                    colorScheme="blue"
                    mr="10px"
                  >
                    <BsArrowUpRight />
                  </Button>
                  <Button onClick={() => deleteNfc(nfc?.id)} colorScheme="red">
                    <BsFillTrashFill />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <NfcDrawer
        activeNfcId={activeNfcId}
        isOpen={!!activeNfcId}
        onClose={() => setActiveNfcId(null)}
        onUpdate={updateList}
      />
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
