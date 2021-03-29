import { GetServerSidePropsContext } from "next";
import { getLinkForAlias } from "../api";
import Page404 from "./404";

const RedirectURL = () => {
  return <Page404 />;
};

export default RedirectURL;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { res } = context;
  const alias = context.query.alias as string;
  const link = await getLinkForAlias(alias);
  console.log(link);
  if (link) {
    res.writeHead(301, { location: link });
    res.end();
  }
  return { props: {} };
};
