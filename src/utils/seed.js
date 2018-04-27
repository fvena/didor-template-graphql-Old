import faker from 'faker';
import { Prisma } from 'prisma-binding';
import * as config from '../utils/vars';

const prisma = new Prisma({
  typeDefs: 'src/database/prisma.generated.graphql', // the auto-generated GraphQL schema of the Prisma API
  endpoint: config.PRISMA_ENDPOINT, // the endpoint of the Prisma API (value set in `.env`)
  secret: config.PRISMA_MANAGEMENT_API_SECRET, // Secret
  debug: true, // log all GraphQL queries & mutations sent to the Prisma API
});

faker.locale = 'es';

const usersAmount = 5;
const postAmount = 20;
const users = [];


async function generateUser() {
  for (let i = 0; i < usersAmount; i++) {
    const user = await prisma.mutation.createUser({ // eslint-disable-line
      data: {
        email: faker.internet.email(),
        name: faker.name.findName(),
      },
    });

    users.push(user.id);
  }

  for (let i = 0; i < postAmount; i++) {
    const published = Math.random() >= 0.5;
    const user = users[Math.floor(Math.random() * users.length)];

    prisma.mutation.createPost({
      data: {
        title: faker.lorem.sentence(),
        text: faker.lorem.paragraph(),
        isPublished: published,
        author: {
          connect: { id: user },
        },
      },
    });
  }
  return true;
}

/**
 * Generador de Usuarios
 */

generateUser();


/**
 * Generador de Posts
 */
