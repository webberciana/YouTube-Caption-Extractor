import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ROUTE_HANDLERS } from './config';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const route = event.resource as keyof typeof ROUTE_HANDLERS;

    const routeHandler = ROUTE_HANDLERS[route];

    if (!routeHandler) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Not Found' }),
      };
    }

    return await routeHandler(JSON.parse(event.body ?? '{}') as any);
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Internal Server Error',
      }),
    };
  }
};
