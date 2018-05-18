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
async function checkIsAuthor(resolver, user, permission) {
  const typeID = resolver.arguments.id;
  const userID = user.userId;
  const type = permission.creatorOfType;

  if (!typeID) throw new Error('Need a Type where search creator');
  if (!type) throw new Error('Need a Type where search creator');

  return prisma.exists[type]({ id: typeID, author: { id: userID } });
}


/**
 * Check if a user has permission to execute a query
 *
 * queries: List of queries
 * rules:   Object with resolvers permissions
 * user:    Object with user id and role
 *
 * Return: Result of checking permissions
 */
async function checkPermission(queries, rules, user, superAdmin) {
  queries.resolvers.forEach((resolver) => {
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

      // superAdmin user no need permissions
      if (user.role !== superAdmin) {
        if (permission.roles.length) {
          if (!permission.roles.includes(user.role)) {
            if (!permission.cretorAllowed) throw new Error('Not authorized');
            if (!checkIsAuthor(resolver, user, permission)) throw new Error('Not authorized');
          }
        } else if (permission.cretorAllowed) {
          if (!checkIsAuthor(resolver, user, permission)) throw new Error('Not authorized');
        }
      }

      // eslint-disable-next-line
      // if (!permission.roles.length || (permission.roles.length && !permission.roles.includes(user.role))) {
      //   if (permission.cretorAllowed) {
      //     if (!user.userId) throw new Error('Must provide a valid user ID');
      //
      //     const authorID = 'authorId';
      //     // Tengo que hacer que los test se ejecuten en el entorno de los test
      //     // Tengo que crear un Usuario en los test
      //     // Tengo que añadir aquí una comprobación del usuario
      //
      //     if (user.userId !== authorID) throw new Error('Not authorized');
      //   }
      // }
    }
  });

  return true;
}


/**
 * Middelware for check if a user has permission to execute a query
 *
 * options: Object with permission module options
 */
function permissions(options = {}) {
  return (request, response, next) => {
    const defaults = {
      appSecret: 'jwtsecret123',
      file: '../application/permissions.json',
      superAdmin: 'KRATOS',
    };

    const settings = Object.assign({}, defaults, options);

    console.log('----------- PERMISSIONS --------------');
    if (request.body.query) {
      const rules = getPermissions(settings.file);
      const queries = parseQuery(request.body.query);
      const authorization = request.headers.authorization;
      const user = (authorization) ? getUser(authorization, settings.appSecret) : null;

      checkPermission(queries, rules, user, settings.superAdmin);
    }

    next();
  };
}

export default permissions;
