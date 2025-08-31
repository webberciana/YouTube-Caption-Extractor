import { serveHtmlHandler } from './serveHtmlHandler';
import { captionsHandler } from './captionsHandler';

export const ROUTES = {
  HOME: '/',
  CAPTIONS: '/api/captions',
} as const;

export const ROUTE_HANDLERS = {
  [ROUTES.HOME]: serveHtmlHandler,
  [ROUTES.CAPTIONS]: captionsHandler,
} as const;

export interface HandlerResult {
  statusCode: number;
  headers?:
    | {
    [header: string]: boolean | number | string;
  }
    | undefined;
  multiValueHeaders?:
    | {
    [header: string]: Array<boolean | number | string>;
  }
    | undefined;
  body: string;
  isBase64Encoded?: boolean | undefined;
}

export interface VideoDetails {
  title: string;
  description: string;
  subtitles: Array<{
    start: string;
    dur: string;
    text: string;
  }>;
}

export interface CaptionsRequestBody {
  videoInput: string;
  lang?: string;
}
