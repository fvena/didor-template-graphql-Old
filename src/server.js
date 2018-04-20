import { GraphQLServer } from 'graphql-yoga';
import { Prisma } from 'prisma-binding';
import { typeDefs, resolvers } from './utils/merges';

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: process.env.PRISMA_ENDPOINT, // the endpoint of the Prisma DB service
      secret: process.env.PRISMA_SECRET, // specified in database/prisma.yml
      debug: process.env.PRISMA_DEBUG, // log all GraphQL queryies & mutations
    }),
  }),
});

const serverOptions = {
  port: process.env.APP_PORT,
};

server
  .start(serverOptions, () => console.log(`Server is running on localhost:${serverOptions.port}`))
  .catch(err => console.log('connection Error', err));
