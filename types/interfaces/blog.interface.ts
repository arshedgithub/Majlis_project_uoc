import { BlogCategory, BlogStatus } from "../enums";

export interface Blog {
    id?: string;
    title: string;
    content: string;
    categroy: BlogCategory
    authorId: string;
    tags?: string[];
    status?: BlogStatus;
    isPublished?: boolean;
    publishedAt?: string;
    createdAt?: string;
    updatedAt?: string;
  }