import parseQuery from '../../../src/utils/parseQuery';
import ast from './__mocks__/parseQuery.ast.json';

describe('Parse Query', () => {
  const query = '{ user (id:"0001") { id, name, email, post (id:"0002") { title, text, likes { author }} } }';
  const queries = '{ user (id:"0001") { id, name, email } post (id:"0002") { title, text }}';
  const mutation = 'mutation { createUser ( name: "John Doe", email: "john@email.com" ) { id, name, email }}';

  test('Devuelve un error si no se indica una query', () => {
    const noQuery = null;
    expect(() => parseQuery(noQuery)).toThrow('No pass graphl query');
  });


  test('Devuelve un error si la query no es válida', () => {
    const badQuery = '{ user { id, name, email}';
    expect(() => parseQuery(badQuery)).toThrow('Syntax error in graphql query');
  });


  test('Devuelve un GraphQLSchema objeto de una query', () => {
    const queryObject = {
      type: 'query',
      resolvers: [
        {
          name: 'user',
          arguments: [
            { name: 'id', value: '0001' },
          ],
          fields: [
            { name: 'id' },
            { name: 'name' },
            { name: 'email' },
            {
              name: 'post',
              arguments: [
                { name: 'id', value: '0002' },
              ],
              fields: [
                { name: 'title' },
                { name: 'text' },
                {
                  name: 'likes',
                  fields: [
                    { name: 'author' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    expect(parseQuery(query)).toMatchObject(queryObject);
  });


  test('Devuelve un GraphQLSchema objeto de una query multiple', () => {
    const queriesObject = {
      type: 'query',
      resolvers: [
        {
          name: 'user',
          arguments: [
            { name: 'id', value: '0001' },
          ],
          fields: [
            { name: 'id' },
            { name: 'name' },
            { name: 'email' },
          ],
        },
        {
          name: 'post',
          arguments: [
            { name: 'id', value: '0002' },
          ],
          fields: [
            { name: 'title' },
            { name: 'text' },
          ],
        },
      ],
    };

    expect(parseQuery(queries)).toMatchObject(queriesObject);
  });


  test('Devuelve un GraphQLSchema objeto de una mutación', () => {
    const mutationObject = {
      type: 'mutation',
      resolvers: [
        {
          name: 'createUser',
          arguments: [
            { name: 'name', value: 'John Doe' },
            { name: 'email', value: 'john@email.com' },
          ],
          fields: [
            { name: 'id' },
            { name: 'name' },
            { name: 'email' },
          ],
        },
      ],
    };

    expect(parseQuery(mutation)).toMatchObject(mutationObject);
  });


  test('Devuelve un GraphQLSchema objeto si pasamos un AST', () => {
    const mutationObject = {
      type: 'query',
      resolvers: [
        {
          name: 'user',
          arguments: [{ name: 'id', value: '5' }],
          fields: [
            { name: 'firstName' },
            { name: 'lastName' },
          ],
        },
      ],
    };

    expect(parseQuery(ast)).toMatchObject(mutationObject);
  });
});
