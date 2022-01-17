import Airtable from "airtable";
import { Banner as BannerData } from "types";

export default async function getBanner(
  airtable: Airtable
): Promise<BannerData | null> {
  let records = null;
  try {
    records = await airtable
      .base("appga5u4QI2sqDov4")("Banners")
      .select({
        maxRecords: 1,
        view: "active_banner",
        fields: ["title", "subtitle", "link", "link_label"],
      })
      .all();
  } catch (e) {
    console.error(e);
  }

  if (!records || records.length < 1) {
    return null;
  }

  const banner: BannerData = {
    title: records[0].get("title"),
    subtitle: records[0].get("subtitle"),
    link: records[0].get("link"),
    link_label: records[0].get("link_label"),
  };

  return banner;
}
