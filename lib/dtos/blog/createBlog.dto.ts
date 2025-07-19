import { z } from 'zod';

export const CreateBlogSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(100),
  author: z.string(),
  image: z.instanceof(File).optional(),
});

export type CreateBlogDto = z.infer<typeof CreateBlogSchema>;
