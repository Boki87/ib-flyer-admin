import { Box } from "@chakra-ui/react";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../lib/session";
import Layout from "../components/Layout";

export default function Devices() {
  return <Layout>Devices</Layout>;
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
