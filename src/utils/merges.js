const path = require('path');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');

/**
 * function getTypes
 * Devuelve un Objeto con todos los tipos definidos en el API
 */
function getTypes() {
  const prismaScheme = fileLoader(path.join(__dirname, '../generated/*.graphql'));
  const apiSchemesArray = fileLoader(path.join(__dirname, '../api/**/*.schema.graphql'));
  const typesArray = prismaScheme.concat(apiSchemesArray);

  return mergeTypes(typesArray, { all: true });
}

/**
 * function getResolvers
 * Devuelve un Objeto con todos los resolvers desarrollados para la API
 */
function getResolvers() {
  const querysArray = fileLoader(path.join(__dirname, '../**/*.query.js'));
  const mutationsArray = fileLoader(path.join(__dirname, '../**/*.mutation.js'));
  const resolversArray = querysArray.concat(mutationsArray);

  return mergeResolvers(resolversArray);
}

const typeDefs = getTypes();
const resolvers = getResolvers();

module.exports = {
  typeDefs,
  resolvers,
};
