import express from 'express';
import cors from 'cors';
import { HandlerResult, ROUTE_HANDLERS, ROUTES } from './config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const sendHandlerResponse = (res: express.Response, handlerResult: HandlerResult) => {
  res.status(handlerResult.statusCode);

  if (handlerResult.headers) {
    Object.entries(handlerResult.headers).forEach(([key, value]) => {
      res.setHeader(key, value as string);
    });
  }

  res.send(handlerResult.body);
};

app.post(ROUTES.CAPTIONS, async (req, res) => {
  const result = await ROUTE_HANDLERS[ROUTES.CAPTIONS](req.body);
  sendHandlerResponse(res, result);
});

app.get(ROUTES.HOME, async (req, res) => {
  const result = await ROUTE_HANDLERS[ROUTES.HOME]();
  sendHandlerResponse(res, result);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
