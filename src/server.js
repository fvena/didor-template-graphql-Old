import depthLimit from 'graphql-depth-limit';
import { GraphQLServer } from 'graphql-yoga';
import { Prisma } from 'prisma-binding';
import { typeDefs, resolvers } from './utils/merges';
import * as config from './utils/vars';

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: config.PRISMA_ENDPOINT, // the endpoint of the Prisma DB service
      secret: config.PRISMA_SECRET, // specified in database/prisma.yml
      debug: config.PRISMA_DEBUG, // log all GraphQL queryies & mutations
    }),
  }),
});

const serverOptions = {
  port: config.APP_PORT,
  validationRules: [
    depthLimit(1),
  ],
};

server
  .start(serverOptions, () => console.log(`Server is running on localhost:${serverOptions.port}, enviroment: ${config.PRISMA_STAGE}`)) // eslint-disable-line no-console
  .catch(err => console.log('connection Error', err)); // eslint-disable-line no-console
