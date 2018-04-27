import path from 'path';
import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';

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

export default getResolvers();
