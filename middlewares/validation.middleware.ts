import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Ajv, { JSONSchemaType } from 'ajv';

const ajv = new Ajv();

ajv.addFormat('email', {
  type: 'string',
  validate: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
});

ajv.addFormat('date', {
  type: 'string',
  validate: /^\d{4}-\d{2}-\d{2}$/,
});

ajv.addFormat('time', {
  type: 'string',
  validate: /^\d{2}:\d{2}$/,
});

ajv.addFormat('year', {
  type: 'string',
  validate: /^(19|20)\d{2}$/,
});

ajv.addFormat('month', {
  type: 'string',
  validate: /^(0[1-9]|1[0-2])$/,
});

export const validateRequest = <T>(schema: JSONSchemaType<T>) => {
  return async (request: NextRequest) => {
    try {
      const body = await request.json();
      
      if (Object.keys(body).length === 0) {
        return NextResponse.next();
      }

      const validate = ajv.compile(schema);
      const isValid = validate(body);

      if (!isValid) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: ajv.errorsText(validate.errors, { separator: '\n' }),
          },
          { status: 400 }
        );
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
  };
};

export const validateQueryParams = <T>(schema: JSONSchemaType<T>) => {
  return async (request: NextRequest) => {
    try {
      const queryParams: Record<string, string> = Object.fromEntries(request.nextUrl.searchParams);
      const processedParams: Record<string, string | number> = { ...queryParams };
      
      // Convert numeric parameters
      for (const [key, value] of Object.entries(queryParams)) {
        if (schema.properties?.[key]?.type === 'number') {
          processedParams[key] = parseInt(value);
        }
      }

      const validate = ajv.compile(schema);
      const isValid = validate(processedParams);

      if (!isValid) {
        return NextResponse.json(
          {
            error: 'Invalid query parameters',
            details: ajv.errorsText(validate.errors, { separator: '\n' }),
          },
          { status: 400 }
        );
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      );
    }
  };
};
