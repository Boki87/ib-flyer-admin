import { useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import NextLink from "next/link";
import {
  Button,
  Box,
  Text,
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

export default function Owner() {
  const [isLoadingData, setIsLoadingData] = useState(false);
  const router = useRouter();
  const { setOwnerData, ownerData, venues, setVenues, nfcs, setNfcs } =
    useGlobalState();
  const userId = router.query.id;

  async function fetchOwnerData() {
    try {
      setIsLoadingData(true);

      //fech owner
      const { data: owner, error } = await supabase
        .from("owners")
        .select()
        .match({ user_id: userId })
        .single();
      if (error) throw Error(error.message);
      setOwnerData(owner);

      //fech venues
      const { data: venuesData, error: venueError } = await supabase
        .from("venues")
        .select()
        .match({ owner_id: owner.user_id });
      if (venueError) throw Error(venueError.message);
      setVenues(venuesData);


      setIsLoadingData(false);
    } catch (e) {
      console.log(e);
      setIsLoadingData(false);
    }
  }

  useEffect(() => {
    fetchOwnerData();
  }, []);

  return (
    <Layout>
      <Text fontSize="xl" fontWeight="bold">
        Owner
      </Text>
      <Text>
        <strong>Name: </strong>
        {ownerData?.full_name}
      </Text>
      <Text>
        <strong>Email: </strong>
        {ownerData?.email}
      </Text>
      <Text>
        <strong>Company: </strong>
        {ownerData?.company_name}
      </Text>
      <NextLink href={`/owner/${userId}/nfcs`}>
        <Button>View NFC's</Button>
      </NextLink>

      <Text fontWeight="bold" mt="20px">
        Venues:{" "}
      </Text>
      <TableContainer w="full">
        <Table variant="striped" size="sm" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Ttile</Th>
              <Th>Description</Th>
              <Th>Website</Th>
              <Th w="100px"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {venues.map((venue) => (
              <Tr cursor="pointer" key={venue.id}>
                <Td _hover={{ textDecoration: "underline" }}>{venue.title}</Td>
                <Td>{venue.description}</Td>
                <Td>{venue.website}</Td>
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
