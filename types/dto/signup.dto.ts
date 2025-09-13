import { JSONSchemaType } from "ajv";
import { UserType } from "../enums";
export interface SignUpDto {
    email: string;
    password: string;
    gender:string;
    confirmPassword?: string;
    name: string;
    contactNumber?: string;
    degree: string;
    faculty: string;
    userType?: UserType;
}

export const registerSchema: JSONSchemaType<{
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    gender:string
    degree:string;
    faculty:string;
    contactNumber?: string;
    userType: UserType;
}> = {
    type: 'object',
    required: ['email', 'password', 'name','degree','faculty','gender','confirmPassword','userType'],
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
        name: { type: 'string', minLength: 2 },
        confirmPassword: { type: 'string', minLength: 6 },
        contactNumber: { type: 'string', minLength: 10, maxLength: 15, nullable: true },
        degree: { type: 'string', minLength: 5 },
        faculty: { type: 'string', minLength: 5 },
        gender: { type: 'string', minLength: 1 },
        userType: {
            type: 'string',
            enum: Object.values(UserType),
            default: UserType.STUDENT
        }
    }
};


