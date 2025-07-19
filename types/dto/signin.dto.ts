import { JSONSchemaType } from "ajv";

export interface SignInDto {
    email: string;
    password: string;
}

export const loginSchema: JSONSchemaType<SignInDto> = {
    type: 'object',
    required: ['email', 'password'],
    additionalProperties: false,
    properties: {
        email: { 
            type: 'string', 
            format: 'email',
            errorMessage: {
                type: "Email must be a string",
                format: "Please enter a valid email address"
            }
        },
        password: { 
            type: 'string', 
            minLength: 8,
            pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$",
            errorMessage: {
                type: "Password must be a string",
                minLength: "Password must be at least 8 characters long",
                pattern: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            }
        },
    },
    errorMessage: {
        type: "Please provide email and password",
        required: {
            email: "Email is required",
            password: "Password is required"
        }
    }
};