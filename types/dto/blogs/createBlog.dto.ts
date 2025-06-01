import { JSONSchemaType } from 'ajv';

export const createBlogSchema: JSONSchemaType<{
  title: string;
  content: string;
  tags?: string[];
}> = {
  type: 'object',
  required: ['title', 'content'],
  properties: {
    title: { type: 'string', minLength: 3, maxLength: 100 },
    content: { type: 'string', minLength: 10 },
    tags: { 
      type: 'array',
      items: { type: 'string' },
      nullable: true
    }
  }
};