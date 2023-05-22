import swaggerJsdoc from 'swagger-jsdoc';
import swaggerui from 'swagger-ui-express';

const specOptions = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Financial API Docs',
      version: '1.0.0'
    },
    servers: [{ url: process.env.API_DOCS_URL }]
  },
  apis: ['./src/domains/**/*.ts', './dist/src/domains/**/*.js']
};

const uiOptions = {
  explorer: true
};

export const specs = swaggerJsdoc(specOptions);
export const url = '/docs';
export const serve = swaggerui.serve;
export const setup = swaggerui.setup(specs, uiOptions);
