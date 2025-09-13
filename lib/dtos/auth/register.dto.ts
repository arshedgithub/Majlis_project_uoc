import { z } from 'zod';

export const RegisterSchema = z.object({
  fullname: z.string().min(3),
  email: z.string().email(),
  gender: z.string(),
  faculty: z.string(),
  degree: z.string(),
  contact: z.string(),
  password: z.string().min(6),
  confirm_password: z.string().min(6),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
