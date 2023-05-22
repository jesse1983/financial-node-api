import express from 'express';
import { Connector } from './entities';
import { entryRoutes } from './domains/entries';
import { accountRoutes } from './domains/accounts';

export default function (connector: Connector) {
  const routes = express.Router();

  routes.use('/entries', entryRoutes(connector));
  routes.use('/accounts', accountRoutes(connector));

  return routes;
}
