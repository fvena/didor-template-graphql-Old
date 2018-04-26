import depthLimit from 'graphql-depth-limit';
import { GraphQLServer } from 'graphql-yoga';
import { Prisma } from './database/prisma.generated';
import { typeDefs, resolvers } from './utils/merges';
import * as config from './utils/vars';

const prisma = new Prisma({
  typeDefs: 'src/database/prisma.generated.graphql',
  endpoint: config.PRISMA_ENDPOINT,
  secret: config.PRISMA_MANAGEMENT_API_SECRET,
});

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => ({
    ...req,
    db: prisma,
  }),
});

const serverOptions = {
  port: config.APP_PORT,
  validationRules: [
    depthLimit(1),
  ],
};

server
  .start(serverOptions, () => console.log(`Server is running on localhost:${serverOptions.port}, enviroment: ${config.ENVIROMENT}`)) // eslint-disable-line no-console
  .catch(err => console.log('connection Error', err)); // eslint-disable-line no-console
