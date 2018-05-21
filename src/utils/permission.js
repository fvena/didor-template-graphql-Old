import jwt from 'jsonwebtoken';
import { Prisma } from 'prisma-binding';
import parseQuery from './parseQuery';
import * as config from '../utils/vars';

const prisma = new Prisma({
  typeDefs: 'src/database/prisma.graphql', // the auto-generated GraphQL schema of the Prisma API
  endpoint: config.PRISMA_ENDPOINT, // the endpoint of the Prisma API (value set in `.env`)
  secret: config.PRISMA_MANAGEMENT_API_SECRET, // Secret
  debug: true, // log all GraphQL queries & mutations sent to the Prisma API
});


/**
 * Get Permissions file
 *
 * file: Path to file with permissions
 *
 * Return: Object with Permissions
 */
function getPermissions(file) {
  try {
    return require(file); // eslint-disable-line
  } catch (error) {
    throw new Error(`Permissions file not found in path: ${file}`);
  }
}


/**
 * Get User data from token
 *
 * authorization: Token string
 * appSecret:     Secret to decode json web json
 *
 * Return: Data from decode token
 */
function getUser(authorization, appSecret) {
  try {
    const token = authorization.replace('Bearer ', '');
    return jwt.verify(token, appSecret);
  } catch (error) {
    return null;
  }
}


/**
 * Check is user is an Author
 *
 * userId: User ID
 *
 * Return: true if user is Author
 */
function checkIsAuthor(resolver, user, permission) {
  const id = (resolver.arguments) ? resolver.arguments.find(argument => argument.name === 'id').value : null;
  const userID = user.userId;
  const type = permission.creatorOfType;

  if (!type) throw new Error('Must provide a creatorOfType in permissions file');

  if (Array.isArray(type)) {
    if (id) return prisma.exists[type]({ id, author_some: { id: userID } });
    return prisma.exists[type]({ author_some: { id: userID } });
  }

  if (id) return prisma.exists[type]({ id, author: { id: userID } });
  return prisma.exists[type]({ author: { id: userID } });
}


/**
 * Middelware for check if a user has permission to execute a query
 *
 * options: Object with permission module options
 */
function permissions(options = {}) {
  return async (request, response, next) => {
    const defaults = {
      appSecret: 'jwtsecret123',
      file: '../application/permissions.json',
      superAdmin: 'KRATOS',
    };

    const settings = Object.assign({}, defaults, options);

    if (!request.body.query) throw new Error('No pass graphl query');

    const rules = await getPermissions(settings.file);
    const queries = await parseQuery(request.body.query);
    const authorization = request.headers.authorization;
    const user = (authorization) ? await getUser(authorization, settings.appSecret) : null;

    // TODO: permitir queries múltiples
    // No puedo sacarlo a una función, porque los test no funcionan con
    // async/await anidados

    // queries.resolvers.forEach(async (resolver) => {
    const [resolver] = queries.resolvers;
    const permission = rules[queries.type][resolver.name];

    // Check if resolver is defined in permissions
    if (!permission) {
      throw new Error(`The graphql resolver: ${resolver.name}, not have defined permission`);
    }


    // Check if resolver syntax is valid
    const onlyAuthenticate = typeof permission.onlyAuthenticate === 'boolean';
    const cretorAllowed = typeof permission.cretorAllowed === 'boolean';
    const roles = Array.isArray(permission.roles);

    if (!onlyAuthenticate || !cretorAllowed || !roles) {
      throw new Error('Syntax error in resolver permission');
    }

    // If onlyAuthenticate is false, every user can pass
    if (permission.onlyAuthenticate) {
      if (!user) throw new Error('Must provide a valid Authorization Code');
      if (!user.role) throw new Error('Must provide a valid Role');
      if (!user.userId) throw new Error('Must provide a valid user ID');

      // superAdmin user no need permissions
      if (user.role !== settings.superAdmin) {
        if (permission.roles.length) {
          if (!permission.roles.includes(user.role)) {
            if (!permission.cretorAllowed) throw new Error('Not authorized');
            if (!await checkIsAuthor(resolver, user, permission)) throw new Error('Not authorized');
          }
        } else if (permission.cretorAllowed) {
          if (!await checkIsAuthor(resolver, user, permission)) throw new Error('Not authorized');
        }
      }
    }
    // });

    next();
  };
}

export default permissions;
