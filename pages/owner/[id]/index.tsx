import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import NextLink from "next/link";
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
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { BsFillTrashFill, BsArrowUpRight } from "react-icons/bs";
import { useVenues } from "../../../hooks/useVenues";
import VenueDrawer from "../../../components/VenueDrawer";
import { useGlobalState } from "../../../context";

export default function Owner() {
  const router = useRouter();
  const userId = router.query.id as string;
  const { setIsVenueDrawerOpen, setActiveVenueId } = useGlobalState();

  const { isLoading, venues, ownerData, deleteVenue } = useVenues(userId);

  if (isLoading) {
    return <Layout>Loading...</Layout>;
  }

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
      {ownerData?.phone && (
        <Text>
          <strong>Phone: </strong>
          {ownerData?.phone}
        </Text>
      )}
      <NextLink href={`/owner/${userId}/nfcs`}>
        <Button colorScheme="blue" mt="10px">
          View NFC's
        </Button>
      </NextLink>

      <HStack>
        <Text fontWeight="bold" mt="20px">
          Venues:{" "}
        </Text>
        <Spacer />
        <Button
          onClick={() => {
            setActiveVenueId(null);
            setIsVenueDrawerOpen(true);
          }}
          size="sm"
          colorScheme="blue"
        >
          ADD
        </Button>
      </HStack>
      <TableContainer w="full">
        <Table variant="striped" size="sm" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Ttile</Th>
              <Th>Phone</Th>
              <Th>Website</Th>
              <Th w="100px"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {venues.map((venue) => (
              <Tr cursor="pointer" key={venue.id}>
                <Td
                  onClick={() => {
                    if (!venue.id) return;
                    setActiveVenueId(venue.id);
                    setIsVenueDrawerOpen(true);
                  }}
                  _hover={{ textDecoration: "underline" }}
                >
                  {venue.title}
                </Td>
                <Td>{venue.phone}</Td>
                <Td>{venue.website}</Td>
                <Td>
                  <Button
                    onClick={() => {
                      if (!venue?.id) return;
                      const r = window.confirm(
                        "Sure you want to delete this venue?"
                      );
                      if (!r) return;
                      deleteVenue(venue.id);
                    }}
                    colorScheme="red"
                  >
                    <BsFillTrashFill />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {venues.length === 0 ? (
        <Text mt="4" textAlign="center">
          No venues...
        </Text>
      ) : null}
      <VenueDrawer />
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
