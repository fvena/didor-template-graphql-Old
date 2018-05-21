import { GraphQLServer } from 'graphql-yoga';
import { Prisma } from 'prisma-binding';
import cors from 'cors';
import bodyParser from 'body-parser';
import permissions from './utils/permission';
import resolvers from './utils/resolvers';
// import directiveResolvers from './utils/directives';
import * as config from './utils/vars';

const db = new Prisma({
  typeDefs: 'src/database/prisma.graphql', // the auto-generated GraphQL schema of the Prisma API
  endpoint: config.PRISMA_ENDPOINT, // the endpoint of the Prisma API (value set in `.env`)
  secret: config.PRISMA_MANAGEMENT_API_SECRET, // Secret
  debug: true, // log all GraphQL queries & mutations sent to the Prisma API
});


// Add directiveResolvers for use custom directives
const server = new GraphQLServer({
  typeDefs: './src/application/schema.graphql',
  resolvers,
  context: req => ({ ...req, db }),
});

const permissionsOptions = {
  appSecret: 'jwtsecret123',
  file: '../application/permissions.json',
  superAdmin: 'KRATOS',
};

server.express.use(cors());
server.express.use(bodyParser.json());
server.express.use(permissions(permissionsOptions));

server.express.get('/status', (req, res) => {
  res.status(200).send('Hello World');
});

// server.express.get('/permission', (req, res) => {
//   const file = '';
//   res.status(200).json();
// });
//
// server.express.post('/permission', (req, res) => {
//   const file = '';
//   res.status(200).json();
// });

// server.express.get('/resolvers', (req, res) => {
//   const result = {};
//   const queries = [];
//   const mutations = [];
//
//   Object.keys(resolvers.Query).forEach((key) => {
//     queries.push(key);
//   });
//
//   Object.keys(resolvers.Mutation).forEach((key) => {
//     mutations.push(key);
//   });
//
//   result.queries = queries;
//   result.mutations = mutations;
//
//   res.status(200).json(result);
// });

// const jsonParser = bodyParser.json();

const serverOptions = {
  port: config.APP_PORT,
};

server
  .start(serverOptions, () => console.log(`Server is running on localhost:${serverOptions.port}, enviroment: ${config.ENVIROMENT}`)) // eslint-disable-line no-console
  .catch(err => console.log('connection Error', err)); // eslint-disable-line no-console
