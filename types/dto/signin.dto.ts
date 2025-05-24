// export const SignDtoSchema = z.object({
//     email: z.string().email(),
//     password: z.string().min(8),
// });

export interface SignInDto {
    email: string;
    password: string;
}
