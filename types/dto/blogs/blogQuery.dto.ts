import { JSONSchemaType } from "ajv";

export const blogQuerySchema: JSONSchemaType<{
    page?: number;
    limit?: number;
    tag?: string;
}> = {
    type: 'object',
    properties: {
        page: { type: 'number', minimum: 1, nullable: true },
        limit: { type: 'number', minimum: 1, maximum: 50, nullable: true },
        tag: { type: 'string', nullable: true }
    }
}; 