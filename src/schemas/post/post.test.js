import { tester } from 'graphql-tester';
import { APP_PORT } from '../../utils/vars';

const testing = tester({
  url: `http://localhost:${APP_PORT}/`,
});

describe('Post resolvers', () => {
  test('Si no hay datos devuelve un array vacio', (done) => {
    testing(`
      {
        drafts {
          id
          title
          text
          author
        }
      }
    `)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.success).toBeTruthy();
        expect(response).toMatchObject({
          data: {
            drafts: [],
          },
        });
        done();
      });
  });

  test('Si no llamo a un resolvers registrado debe devolver error', (done) => {
    testing(`
      {
        mutation {
          createDrafts () {}
        }
      }
    `)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.success).toBeFalsy();
        done();
      });
  });

  test('Añadir un borrador', (done) => {
    testing(`
      mutation {
        createDraft (
          title: "Post 1"
          text: "Texto 1"
        ) {
          id
          title
          text
        }
      }
    `)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.success).toBeTruthy();
        expect(response.data.id).not.toBeNull();
        const idInserted = response.data.createDraft.id;
        expect(response).toMatchObject({
          data: {
            createDraft:
              {
                id: idInserted,
                title: 'Post 1',
                text: 'Texto 1',
              },
          },
        });
        done();
      });
  });
});
