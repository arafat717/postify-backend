import { PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";

export interface IPostPayload {
  title: string;
  content: string;
  thumbnail: string;
  isFeatured: boolean;
  status: PostStatus;
  tags: string[];
}

export interface IUpdatePost {
  title?: string;
  content?: string;
  thumbnail?: string;
  isFeatured?: boolean;
  status?: PostStatus;
  tags?: string[];
}

export interface IPostQuery extends PostWhereInput {
  searchTerm?:string,
  limit?:string,
  page?:string,
  sortOrder?:string,
  sortBy?: string
}
