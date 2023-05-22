import express from 'express';
import routes from './routes';
import errorHandler from './config/errorHandler';
import { url, serve, setup } from './config/openapi';
import { Connector } from './entities';

export default function (connection: Connector) {
  const app = express();

  app.use(express.json());
  app.use(url, serve, setup);
  app.use('/api', routes(connection));
  app.use('/health', (req, res) => res.send('API Running'));

  app.use(errorHandler);

  return app;
}
