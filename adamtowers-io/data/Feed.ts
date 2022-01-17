import renderToString from "next-mdx-remote/render-to-string";
import Airtable from "airtable";
import {
  Achievement,
  Employment,
  Project,
  Moment,
  FeedItem,
  FeedItemType,
} from "../types";

async function getEmployments(airtable: Airtable): Promise<Employment[]> {
  let records = [];
  try {
    records = await airtable
      .base("appga5u4QI2sqDov4")("Employment")
      .select({
        fields: [
          "title",
          "tag_line",
          "desc",
          "end_date",
          "time_desc",
          "image",
          "link",
          "link_label",
        ],
      })
      .all();
  } catch (e) {
    console.warn(e);
  }

  return await Promise.all(
    records.map(async (feedItem) => {
      const md_desc = await renderToString(feedItem.get("desc") ?? "");
      const employment: Employment = {
        title: feedItem.get("title"),
        tag_line: feedItem.get("tag_line"),
        desc: md_desc,
        time_desc: feedItem.get("time_desc"),
        tags: feedItem.get("tags") ?? [],
        type: FeedItemType.Employment,
      };

      const date = feedItem.get("end_date");
      if (date) employment.date = date;

      const link = feedItem.get("link");
      if (link) employment.link = link;

      const link_label = feedItem.get("link_label");
      if (link_label) employment.link_label = link_label;

      const image = feedItem.get("image");
      if (image?.[0]?.url) employment.image = image[0].url;

      return employment;
    })
  );
}

async function getProjects(airtable: Airtable): Promise<Project[]> {
  let records = [];
  try {
    records = await airtable
      .base("appga5u4QI2sqDov4")("Project")
      .select({
        fields: [
          "title",
          "tag_line",
          "desc",
          "end_date",
          "time_desc",
          "image",
          "link",
          "link_label",
        ],
      })
      .all();
  } catch (e) {
    console.warn(e);
  }

  return await Promise.all(
    records.map(async (feedItem) => {
      const md_desc = await renderToString(feedItem.get("desc") ?? "");
      const project: Project = {
        title: feedItem.get("title"),
        tag_line: feedItem.get("tag_line"),
        desc: md_desc,
        time_desc: feedItem.get("time_desc"),
        tags: feedItem.get("tags") ?? [],
        type: FeedItemType.Project,
      };

      const date = feedItem.get("end_date");
      if (date) project.date = date;

      const link = feedItem.get("link");
      if (link) project.link = link;

      const link_label = feedItem.get("link_label");
      if (link_label) project.link_label = link_label;

      const image = feedItem.get("image");
      if (image?.[0]?.url) project.image = image[0].url;

      return project;
    })
  );
}

async function getAchievements(airtable: Airtable): Promise<Achievement[]> {
  let records = [];
  try {
    records = await airtable
      .base("appga5u4QI2sqDov4")("Achievement")
      .select({
        fields: [
          "title",
          "tag_line",
          "desc",
          "date",
          "time_desc",
          "image",
          "link",
          "link_label",
        ],
      })
      .all();
  } catch (e) {
    console.warn(e);
  }

  return await Promise.all(
    records.map(async (feedItem) => {
      const md_desc = await renderToString(feedItem.get("desc") ?? "");
      const achivement: Achievement = {
        title: feedItem.get("title"),
        tag_line: feedItem.get("tag_line"),
        desc: md_desc,
        time_desc: feedItem.get("time_desc"),
        tags: feedItem.get("tags") ?? [],
        type: FeedItemType.Achievement,
      };

      const date = feedItem.get("date");
      if (date) achivement.date = date;

      const link = feedItem.get("link");
      if (link) achivement.link = link;

      const link_label = feedItem.get("link_label");
      if (link_label) achivement.link_label = link_label;

      const image = feedItem.get("image");
      if (image?.[0]?.url) achivement.image = image[0].url;

      return achivement;
    })
  );
}

async function getMoments(airtable: Airtable): Promise<Moment[]> {
  let records = [];
  try {
    records = await airtable
      .base("appga5u4QI2sqDov4")("Moment")
      .select({
        fields: ["title", "tag_line", "date", "time_desc"],
      })
      .all();
  } catch (e) {
    console.warn(e);
  }

  return await Promise.all(
    records.map(async (feedItem) => {
      const moment: Moment = {
        title: feedItem.get("title"),
        tag_line: feedItem.get("tag_line"),
        time_desc: feedItem.get("time_desc"),
        type: FeedItemType.Moment,
      };

      const date = feedItem.get("date");
      if (date) moment.date = date;

      return moment;
    })
  );
}

export default async function getFeed(airtable: Airtable): Promise<{
  historyFeed: FeedItem[];
  currentFeed: FeedItem[];
}> {
  const recordsByType = await Promise.all([
    getEmployments(airtable),
    getProjects(airtable),
    getAchievements(airtable),
    getMoments(airtable),
  ]);

  const feedItems: FeedItem[] = recordsByType.flat();

  const currentFeed: FeedItem[] = [];
  const historyFeed: FeedItem[] = [];

  for (const item of feedItems) {
    if (item.date) {
      historyFeed.push(item);
    } else {
      currentFeed.push(item);
    }
  }

  historyFeed.sort((a, b) => {
    if (a.date && b.date) {
      return a.date > b.date ? -1 : 1;
    } else {
      return 0;
    }
  });

  return {
    historyFeed,
    currentFeed,
  };
}
