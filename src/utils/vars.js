const env = (process.env.NODE_ENV === 'development') ? '.env' : `.env.${process.env.NODE_ENV}`;

require('dotenv').config({ path: env });

const ENVIROMENT = process.env.NODE_ENV;
const APP_NAME = process.env.APP_NAME;
const APP_PORT = process.env.APP_PORT;
const PRISMA_ENDPOINT = process.env.PRISMA_ENDPOINT;
const PRISMA_CLUSTER = process.env.PRISMA_CLUSTER;
const PRISMA_MANAGEMENT_API_SECRET = process.env.PRISMA_MANAGEMENT_API_SECRET;
const PRISMA_DEBUG = process.env.PRISMA_DEBUG;

export {
  ENVIROMENT,
  APP_NAME,
  APP_PORT,
  PRISMA_ENDPOINT,
  PRISMA_CLUSTER,
  PRISMA_MANAGEMENT_API_SECRET,
  PRISMA_DEBUG,
};
