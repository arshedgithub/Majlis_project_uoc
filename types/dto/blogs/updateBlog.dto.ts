import { JSONSchemaType } from "ajv";

export const updateBlogSchema: JSONSchemaType<{
    title?: string;
    content?: string;
    tags?: string[];
  }> = {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 3, maxLength: 100, nullable: true },
      content: { type: 'string', minLength: 10, nullable: true },
      tags: { 
        type: 'array',
        items: { type: 'string' },
        nullable: true
      }
    }
  };
  