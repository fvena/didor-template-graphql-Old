import gql from 'graphql-tag';


function getAstQuery(query) {
  try {
    if (query.definitions) return query;

    return gql`${query}`; // eslint-disable-line
  } catch (error) {
    throw new Error('Syntax error in graphql query');
  }
}


function getArguments(argumentsArray) {
  const result = [];

  if (argumentsArray && argumentsArray.length) {
    argumentsArray.forEach((argumentItem) => {
      const argumentObject = {};

      argumentObject.name = argumentItem.name.value;
      argumentObject.value = argumentItem.value.value;

      result.push(argumentObject);
    });
  }

  return result;
}


function getFields(fields) {
  const result = [];

  if (fields && fields.length) {
    fields.forEach((field) => {
      if (field.name.value !== '__schema') {
        const fieldObject = {};
        const argumentsArray = getArguments(field.arguments);
        const fieldsArray = (field.selectionSet) ? getFields(field.selectionSet.selections) : null;

        fieldObject.name = field.name.value;
        if (argumentsArray && argumentsArray.length) fieldObject.arguments = argumentsArray;
        if (fieldsArray && fieldsArray.length) fieldObject.fields = fieldsArray;

        result.push(fieldObject);
      }
    });
  }

  return result;
}


function parseQuery(query) {
  if (!query) throw new Error('No pass graphl query in body request');

  const astQuery = getAstQuery(query);
  const queries = {};

  queries.type = astQuery.definitions[0].operation;
  queries.resolvers = getFields(astQuery.definitions[0].selectionSet.selections);

  return queries;
}

export default parseQuery;
