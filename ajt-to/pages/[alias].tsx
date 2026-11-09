import { GetServerSideProps } from "next";
import { getLinkForAlias } from "../api/alias";

const RedirectURL = () => null;

export default RedirectURL;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const alias = context.query.alias as string;
  const link = await getLinkForAlias(alias);
  if (!link) {
    return { notFound: true };
  }
  return { redirect: { destination: link, statusCode: 301 } };
};
