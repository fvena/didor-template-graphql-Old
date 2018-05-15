import { GraphQLServer } from 'graphql-yoga';
import { Prisma } from 'prisma-binding';
import cors from 'cors';
import resolvers from './utils/resolvers';
import * as config from './utils/vars';


const db = new Prisma({
  typeDefs: 'src/database/prisma.graphql', // the auto-generated GraphQL schema of the Prisma API
  endpoint: config.PRISMA_ENDPOINT, // the endpoint of the Prisma API (value set in `.env`)
  secret: config.PRISMA_MANAGEMENT_API_SECRET, // Secret
  debug: true, // log all GraphQL queries & mutations sent to the Prisma API
});

const server = new GraphQLServer({
  typeDefs: './src/application/schema.graphql',
  resolvers,
  context: req => ({ ...req, db }),
});

server.express.use(cors());

server.express.get('/status', (req, res) => {
  res.status(200).send('Hello World');
});


const serverOptions = {
  port: config.APP_PORT,
};

server
  .start(serverOptions, () => console.log(`Server is running on localhost:${serverOptions.port}, enviroment: ${config.ENVIROMENT}`)) // eslint-disable-line no-console
  .catch(err => console.log('connection Error', err)); // eslint-disable-line no-console
