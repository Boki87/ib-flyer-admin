import { useState, useEffect, SyntheticEvent } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import Layout from "../components/Layout";
import {
  Input,
  Button,
  HStack,
  VStack,
  TableContainer,
  Thead,
  Tr,
  Th,
  Td,
  Table,
  Tbody,
} from "@chakra-ui/react";
import supabase from "../lib/supabase";
import OwnerDrawer from "../components/OwnerDrawer";
import { BsFillTrashFill, BsArrowUpRight } from "react-icons/bs";
import { useGlobalState } from "../context";
import { useRouter } from "next/router";

export default function Home() {
  const {
    owners,
    setOwners,
    setLoadingOwners,
    setIsOwnerDrawerOpen,
    setActiveOwnerId,
  } = useGlobalState();

  const [searchQ, setSearchQ] = useState("");
  const [filteredOwners, setFilteredOwners] = useState(owners);

  const router = useRouter();

  async function deleteOwnerHandler(owner_id: string | undefined) {
    if (!owner_id) return;

    const r = window.confirm("Sure you want to delete this user");

    if (!r) return;

    const { data, error } = await supabase
      .from("owners")
      .update({ is_active: false })
      .match({ id: owner_id });

    console.log(data);
  }

  async function fetchOwners() {
    try {
      setLoadingOwners(true);
      const { data, error } = await supabase
        .from("owners")
        .select()
        .match({ is_active: true });

      if (error) throw Error(error.message);

      setOwners(data);
      setLoadingOwners(false);
    } catch (e) {
      console.log(e);
      setLoadingOwners(false);
    }
  }

  useEffect(() => {
    if (searchQ !== "") {
      const fOwners = owners.filter(
        (o) =>
          o.email?.toLocaleLowerCase().includes(searchQ.toLocaleLowerCase()) ||
          o.full_name?.toLocaleLowerCase().includes(searchQ.toLocaleLowerCase())
      );
      setFilteredOwners(fOwners);
    } else {
      setFilteredOwners(owners);
    }
  }, [searchQ, owners]);

  useEffect(() => {
    fetchOwners();
  }, []);

  return (
    <Layout>
      <HStack>
        <Input
          type="search"
          placeholder="Search owner"
          value={searchQ}
          onChange={(e: SyntheticEvent) => {
            let { value } = e.target as HTMLInputElement;
            setSearchQ(value);
          }}
        />
        <Button
          onClick={() => {
            setActiveOwnerId(null);
            setIsOwnerDrawerOpen(true);
          }}
        >
          ADD
        </Button>
      </HStack>
      <VStack>
        <TableContainer w="full">
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Email</Th>
                <Th>Name</Th>
                <Th>Company</Th>
                <Th w="100px">Venues/Devices</Th>
                <Th w="100px"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredOwners.map((owner) => (
                <Tr cursor="pointer" key={owner.id}>
                  <Td
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => {
                      if (!owner.id) return;
                      setActiveOwnerId(owner.id);
                      setIsOwnerDrawerOpen(true);
                    }}
                  >
                    {owner.email}
                  </Td>
                  <Td>{owner.full_name}</Td>
                  <Td>{owner.company_name}</Td>
                  <Td>
                    <Button
                      colorScheme="blue"
                      onClick={() => {
                        if (!owner.user_id) return;
                        router.push(`/owner/${owner.user_id}`);
                      }}
                    >
                      <BsArrowUpRight />
                    </Button>
                  </Td>
                  <Td onClick={() => deleteOwnerHandler(owner.id)}>
                    <Button colorScheme="red">
                      <BsFillTrashFill />
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
      <OwnerDrawer />
    </Layout>
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
