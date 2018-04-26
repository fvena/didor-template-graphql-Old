import faker from 'faker';
import { Prisma } from '../database/prisma.generated';
import * as config from '../utils/vars';

const prisma = new Prisma({
  typeDefs: 'src/database/prisma.generated.graphql',
  endpoint: config.PRISMA_ENDPOINT,
  secret: config.PRISMA_MANAGEMENT_API_SECRET,
});

faker.locale = 'es';


const postAmount = 20;

/**
 * Generador de Posts
 */
for (let i = 0; i < postAmount; i++) {
  const published = Math.random() >= 0.5;

  prisma.mutation.createPost({
    data: {
      title: faker.lorem.sentence(),
      text: faker.lorem.paragraph(),
      author: faker.name.findName(),
      isPublished: published,
    },
  });
}
