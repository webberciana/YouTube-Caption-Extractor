import { readFileSync } from 'fs';
import { HandlerResult } from './config';

export const serveHtmlHandler = async (): Promise<HandlerResult> => {
  try {
    const body = readFileSync('public/index.html', 'utf-8');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
      body,
    };
  } catch (error) {
    console.error('Error serving HTML:', error);

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Internal server error',
    };
  }
};
