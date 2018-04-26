import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

/**
 * function getTypes
 * Devuelve un Objeto con todos los tipos definidos en el API
 */
function getTypes() {
  // const prismaScheme = fileLoader(path.join(__dirname, '../generated/*.graphql'));
  // const apiSchemesArray = fileLoader(path.join(__dirname, '../api/**/*.schema.graphql'));
  // const typesArray = prismaScheme.concat(apiSchemesArray);

  const typesArray = fileLoader(path.join(__dirname, '../schemas/**/*.graphql'));

  return mergeTypes(typesArray, { all: true });
}

/**
 * function getResolvers
 * Devuelve un Objeto con todos los resolvers desarrollados para la API
 */
function getResolvers() {
  const querysArray = fileLoader(path.join(__dirname, '../schemas/**/*.query.js'));
  const mutationsArray = fileLoader(path.join(__dirname, '../schemas/**/*.mutation.js'));
  const resolversArray = querysArray.concat(mutationsArray);

  return mergeResolvers(resolversArray);
}

const typeDefs = getTypes();
const resolvers = getResolvers();

export {
  typeDefs,
  resolvers,
};
