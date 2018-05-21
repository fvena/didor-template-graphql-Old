import httpMocks from 'node-mocks-http';
import jwt from 'jsonwebtoken';
import { Prisma } from 'prisma-binding';
import * as config from '../../../src/utils/vars';
import permissions from '../../../src/utils/permission';

const prisma = new Prisma({
  typeDefs: 'src/database/prisma.graphql', // the auto-generated GraphQL schema of the Prisma API
  endpoint: config.PRISMA_ENDPOINT, // the endpoint of the Prisma API (value set in `.env`)
  secret: config.PRISMA_MANAGEMENT_API_SECRET, // Secret
  debug: false, // log all GraphQL queries & mutations sent to the Prisma API
});


/**
 * Return promise with result of middelware
 */
function getStatus(request, response, options) {
  const middelware = permissions(options);

  return new Promise((resolve) => {
    middelware(request, response, () => { resolve(response.statusCode); });
  });
}

function getError(request, response, options) {
  const middelware = permissions(options);

  return new Promise((reject) => {
    reject(middelware(request, response, () => {}));
  });
}


/**
 * Return valid Authorization token
 */
function token(userId, role, secret) {
  const Authorization = jwt.sign({ userId, role }, secret);
  return { Authorization };
}


describe('Permissions Module', () => {
  // Valid data
  const appSecret = config.APP_SECRET;
  const file = '../../test/unit/specs/__mocks__/permissions.json';
  let user = {};
  let post = {};
  let comment = {};

  beforeAll(async (done) => {
    user = await prisma.mutation.createUser({ data: { name: 'author', email: 'author@email.com', password: 'foobarfoo' } });
    post = await prisma.mutation.createPost({ data: { title: 'postTitle', text: 'postText', author: { connect: { id: user.id } } } });
    comment = await prisma.mutation.createComment({ data: { text: 'commentText', author: { connect: { id: user.id } }, post: { connect: { id: post.id } } } });
    done();
  });

  // Parámetros básicos incorrectos
  describe('Parámetros incorrectos', () => {
    test('Devuelve un error si no hay un archivo de validación', () => {
      const options = { file: '/nofile.json' };
      const request = httpMocks.createRequest({ body: { query: '{ noAuthenticate { name } }' } });
      const response = httpMocks.createResponse();

      return expect(getError(request, response, options)).rejects.toThrow(`Permissions file not found in path: ${options.file}`);
    });

    test('Devuelve un error si no se indica una query', () => {
      const options = { file };
      const request = httpMocks.createRequest();
      const response = httpMocks.createResponse();

      return expect(getError(request, response, options)).rejects.toThrow('No pass graphl query');
    });

    test('Devuelve un error si la query no es válida', () => {
      const options = { file };
      const request = httpMocks.createRequest({ body: { query: '{ notValid { name }' } });
      const response = httpMocks.createResponse();

      return expect(getError(request, response, options)).rejects.toThrow('Syntax error in graphql query');
    });

    test('Devuelve un error si el resolver no existe', () => {
      const options = { file };
      const request = httpMocks.createRequest({ body: { query: '{ notExit { name } }' } });
      const response = httpMocks.createResponse();

      return expect(getError(request, response, options)).rejects.toThrow('The graphql resolver: notExit, not have defined permission');
    });

    test('Devuelve un error si el resolver no es válido', () => {
      const options = { file };
      const request = httpMocks.createRequest({ body: { query: '{ noValidResolver { name } }' } });
      const response = httpMocks.createResponse();

      return expect(getError(request, response, options)).rejects.toThrow('Syntax error in resolver permission');
    });
  });

  // Usuario autenticado
  describe('Se requiere estar autenticado', () => {
    test('Devuelve un 200 si el resolver es una query y no necesita autenticación aunque necesite ser el autor o un rol', () => {
      const options = { file };
      const request = httpMocks.createRequest({ body: { query: '{ noAuthenticate { name } }' } });
      const response = httpMocks.createResponse();

      return getStatus(request, response, options)
        .then((result) => { expect(result).toBe(200); });
    });

    test('Devuelve un 200 si el resolver es un mutation y no necesita autenticación aunque necesite ser el autor o un rol', () => {
      const options = { file };
      const request = httpMocks.createRequest({ body: { query: 'mutation { noAuthenticate( name:"john" ){ name } }' } });
      const response = httpMocks.createResponse();

      return getStatus(request, response, options)
        .then((result) => { expect(result).toBe(200); });
    });

    test('Devuelve un error si no pasamos un token', () => {
      const options = { file };
      const request = httpMocks.createRequest({ body: { query: '{ authenticate { name } }' } });
      const response = httpMocks.createResponse();

      return expect(getError(request, response, options)).rejects.toThrow('Must provide a valid Authorization Code');
    });

    test('Devuelve un error si el token no es válido', () => {
      const options = { file };
      const request = httpMocks.createRequest({ Authorization: 'Not valid authorization code', body: { query: '{ authenticate { name } }' } });
      const response = httpMocks.createResponse();

      return expect(getError(request, response, options)).rejects.toThrow('Must provide a valid Authorization Code');
    });

    test('Devuelve un 200 si el usuario está autenticado y el resolver no necesita ser el autor, o tener un rol', () => {
      const options = { appSecret, file };
      const headers = token('userId', 'ADMIN', config.APP_SECRET);
      const request = httpMocks.createRequest({ headers, body: { query: '{ noAuthenticate { name } }' } });
      const response = httpMocks.createResponse();

      return getStatus(request, response, options)
        .then((result) => { expect(result).toBe(200); });
    });
  });

  // Roles
  describe('Se requiere un rol y estar autenticado', () => {
    test('Devuelve un error si el usuario no tiene rol', () => {
      const options = { appSecret, file };
      const headers = token('userId', null, config.APP_SECRET);
      const request = httpMocks.createRequest({ headers, body: { query: '{ roles { name } }' } });
      const response = httpMocks.createResponse();

      return expect(getError(request, response, options)).rejects.toThrow('Must provide a valid Role');
    });

    test('Devuelve un error si el rol del usuario no es válido y no es el autor', () => {
      const options = { appSecret, file };
      const headers = token('userId', 'NOT_VALID_ROLE', config.APP_SECRET);
      const request = httpMocks.createRequest({ headers, body: { query: '{ roles { name } }' } });
      const response = httpMocks.createResponse();

      return expect(getError(request, response, options)).rejects.toThrow('Not authorized');
    });

    test('Devuelve un 200 si el rol del usuario es válido aunque requiera ser el autor y no lo sea', () => {
      const options = { appSecret, file };
      const headers = token('userId', 'ADMIN', config.APP_SECRET);
      const request = httpMocks.createRequest({ headers, body: { query: '{ roles { name } }' } });
      const response = httpMocks.createResponse();

      return getStatus(request, response, options)
        .then((result) => { expect(result).toBe(200); });
    });

    test('Devuelve un 200 si el usuario es superAdmin', () => {
      const options = { appSecret, file, superAdmin: 'KRATOS' };
      const headers = token('userId', 'KRATOS', config.APP_SECRET);
      const request = httpMocks.createRequest({ headers, body: { query: '{ roles { name } }' } });
      const response = httpMocks.createResponse();

      return getStatus(request, response, options)
        .then((result) => { expect(result).toBe(200); });
    });
  });

  // Autor
  describe('Se requiere ser el autor y estar autenticado', () => {
    test('Devuelve un error si el usuario no tiene id y no tiene un rol valido', async () => {
      const options = { appSecret, file };
      const headers = token(null, 'NOT_VALID_ROLE', config.APP_SECRET);
      const request = httpMocks.createRequest({ headers, body: { query: '{ author { name } }' } });
      const response = httpMocks.createResponse();
      await expect(getError(request, response, options)).rejects.toThrow('Must provide a valid user ID');
    });

    test('Devuelve un error si no se ha definido en los permisos el tipo del que el usuario es el creador', async () => {
      const options = { appSecret, file };
      const headers = token('notAuthor', 'NOT_VALID_ROLE', config.APP_SECRET);
      const request = httpMocks.createRequest({ headers, body: { query: '{ nocreatorOfType { name } }' } });
      const response = httpMocks.createResponse();

      await expect(getError(request, response, options)).rejects.toThrow('Must provide a creatorOfType in permissions file');
    });

    test('Devuelve un error si el usuario no es el autor y no tiene un rol válido', () => {
      const options = { appSecret, file };
      const headers = token('notAuthor', 'NOT_VALID_ROLE', config.APP_SECRET);
      const request = httpMocks.createRequest({ headers, body: { query: '{ author { name } }' } });
      const response = httpMocks.createResponse();
      return expect(getError(request, response, options)).rejects.toThrow('Not authorized');
    });

    test('Devuelve un 200 si el usuario es el autor ', () => {
      const options = { appSecret, file };
      const headers = token('authorId', 'ADMIN', config.APP_SECRET);
      const request = httpMocks.createRequest({ headers, body: { query: '{ author { name } }' } });
      const response = httpMocks.createResponse();

      return getStatus(request, response, options)
        .then((result) => { expect(result).toBe(200); });
    });

    test('Devuelve un 200 si el usuario es autor en algún nodo pero no tiene un rol válido', () => {
      const options = { appSecret, file };
      const headers = token(user.id, 'NOT_VALID_ROLE', config.APP_SECRET);
      const request = httpMocks.createRequest({ headers, body: { query: `{ author (id: "${comment.id}") { name } }` } });
      const response = httpMocks.createResponse();

      return getStatus(request, response, options)
        .then((result) => { expect(result).toBe(200); });
    });

    test('Devuelve un 200 si el usuario es el autor de un nodo pero no tiene un rol válido', () => {
      const options = { appSecret, file };
      const headers = token(user.id, 'NOT_VALID_ROLE', config.APP_SECRET);
      const request = httpMocks.createRequest({ headers, body: { query: '{ author { name } }' } });
      const response = httpMocks.createResponse();

      return getStatus(request, response, options)
        .then((result) => { expect(result).toBe(200); });
    });

    test('Devuelve un 200 si el usuario es uno de los autores en algún nodo pero no tiene un rol válido', () => {
      const options = { appSecret, file };
      const headers = token(user.id, 'NOT_VALID_ROLE', config.APP_SECRET);
      const request = httpMocks.createRequest({ headers, body: { query: `{ authors (id: "${post.id}") { name } }` } });
      const response = httpMocks.createResponse();

      return getStatus(request, response, options)
        .then((result) => { expect(result).toBe(200); });
    });

    test('Devuelve un 200 si el usuario es uno de los autores de un nodo pero no tiene un rol válido', () => {
      const options = { appSecret, file };
      const headers = token(user.id, 'NOT_VALID_ROLE', config.APP_SECRET);
      const request = httpMocks.createRequest({ headers, body: { query: '{ authors { name } }' } });
      const response = httpMocks.createResponse();

      return getStatus(request, response, options)
        .then((result) => { expect(result).toBe(200); });
    });
  });


  // Varias queries
  // describe('Comprobamos cuando se realizan varias queries simultaneas', () => {
  //   test('Devuelve un error si el usuario no tiene permiso en alguna de las queries', () => {
  //     const options = { appSecret, file };
  //     const headers = token('notAuthor', 'NOT_VALID_ROLE', config.APP_SECRET);
  //     const request = httpMocks.createRequest({ headers, body: { query: '{ author { name } } { roles { name } }' } });
  //     const response = httpMocks.createResponse();
  //     const middelware = permissions(options);
  //     const result = () => middelware(request, response, () => {});
  //
  //     expect(result).toThrow('Not authorized');
  //   });
  //
  //   test('Devuelve un 200 si el usuario tiene permiso en todas las queries', () => {
  //     const options = { appSecret, file };
  //     const headers = token('authorId', 'ADMIN', config.APP_SECRET);
  //     const request = httpMocks.createRequest({ headers, body: { query: '{ author { name } } { roles { name } }' } });
  //     const response = httpMocks.createResponse();
  //
  //     return getStatus(request, response, options)
  //       .then((result) => { expect(result).toBe(200); });
  //   });

  // TODO: Comprobar los permisos de las mutations anidadas
  // });
});
