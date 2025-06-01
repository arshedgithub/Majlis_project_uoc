import { JSONSchemaType } from "ajv";

export const loginSchema: JSONSchemaType<{
    email: string;
    password: string;
  }> = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
    },
  };

export interface SignInDto {
    email: string;
    password: string;
}
