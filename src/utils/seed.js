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
    // Genera aleatoriamente un valor true/false
    const published = Math.random() >= 0.5;

    // Genera un listado aleatorio de autores para un post
    const maxNumAuthors = 3;
    const numAuthorsPost = Math.floor(Math.random() * maxNumAuthors) + 1;
    const authors = await getRandomsUser(users, numAuthorsPost);

    // Genera un listado aleatorio de usuarios que les gusta un post
    const maxNumLikes = users.length;
    const numLikesPost = Math.floor(Math.random() * maxNumLikes) + 1;
    const likes = await getRandomsUser(users, numLikesPost);

    // Genera un único author aleatoriamente
    const maxNumComments = 10;
    const numCommentsPost = Math.floor(Math.random() * maxNumComments) + 1;
    const comments = await getComments(users,numCommentsPost);

    prisma.mutation.createPost({
      data: {
        title: faker.lorem.sentence(),
        text: faker.lorem.paragraph(),
        isPublished: published,
        author: {
          connect: authors,
        },
        likedBy: {
          connect: likes,
        },
        comments: {
          create: comments,
        },
      },
    });
  }
  return true;
}

/**
 * Generador de Usuarios
 */
function getRandomsUser(array, n) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, n);
  const result = [];

  for (let i = 0; i < n; i++) {
    const user = {};
    user.id = selected[i];
    result.push(user);
  }

  return result;
}


function getComments(usersArray, n) {
  const result = [];

  for (let i = 0; i < n; i++) {
    const author = usersArray[Math.floor(Math.random() * usersArray.length)];
    const text = faker.lorem.sentence();
    const user = {};
    const comment = {};

    user.id = author;

    comment.text = text;
    comment.commentBy = {};
    comment.commentBy.connect = user;

    result.push(comment);
  }

  return result;
}

generateUser();
