import { JSONSchemaType } from "ajv";
import { UserType } from "../enums";

export const registerSchema: JSONSchemaType<{
    email: string;
    password: string;
    name: string;
    userType?: UserType;
}> = {
    type: 'object',
    required: ['email', 'password', 'name'],
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
        name: { type: 'string', minLength: 2 },
        userType: {
            type: 'string',
            enum: Object.values(UserType),
            nullable: true,
            default: UserType.STUDENT
        }
    }
};

export interface SignUpDto {
    email: string;
    password: string;
    name: string;
    userType?: UserType;
}
