export interface BaseFeedItem {
  title: string;
  tag_line: string;
  date?: string;
  time_desc: string | false;
  tags?: string[];
  type: FeedItemType;
}

export interface Employment extends BaseFeedItem {
  desc: string;
  image?: string;
  link?: string;
  link_label?: string;
  type: FeedItemType.Employment;
}

export interface Project extends BaseFeedItem {
  desc: string;
  image?: string;
  link?: string;
  link_label?: string;
  type: FeedItemType.Project;
}

export interface Moment extends BaseFeedItem {
  type: FeedItemType.Moment;
}

export interface Achievement extends BaseFeedItem {
  desc: string;
  image?: string;
  link?: string;
  link_label?: string;
  type: FeedItemType.Achievement;
}

export type FeedItem = Employment | Project | Moment | Achievement;

export enum FeedItemType {
  Moment = "moment",
  Employment = "employment",
  Project = "project",
  Achievement = "achievement",
}

export type BlogPostStatus = "published" | "unlisted" | "private";

export interface BlogPostMeta {
  slug: string;
  status: BlogPostStatus;
  title: string;
  date_release?: string;
  date_edit?: string;
  date_release_desc?: string;
  date_edit_desc?: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

export type Banner = {
  title: string;
  subtitle: string;
  link: string;
  link_label: string;
};
