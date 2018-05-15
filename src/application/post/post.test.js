import { tester } from 'graphql-tester';
import { APP_PORT } from '../../utils/vars';

const testing = tester({
  url: `http://localhost:${APP_PORT}/`,
});

let userID = ''; // eslint-disable-line
let postID = ''; // eslint-disable-line

expect.extend({
  toContainObject(received, argument) {
    const pass = this.equals(
      received,
      expect.arrayContaining([
        expect.objectContaining(argument),
      ]),
    );

    if (pass) {
      return {
        message: () => (`expected ${this.utils.printReceived(received)} not to contain object ${this.utils.printExpected(argument)}`),
        pass: true,
      };
    }

    return {
      message: () => (`expected ${this.utils.printReceived(received)} to contain object ${this.utils.printExpected(argument)}`),
      pass: false,
    };
  },
});

describe('Post resolvers', () => {
  beforeAll((done) => {
    testing(`
      mutation {
        createUser (
          email: "autor@email.com"
          name: "John Doe"
        ) {
          id
        }
      }
    `)
      .then((response) => {
        userID = response.data.createUser.id;
        done();
      });
  });


  test('Debería devolver un array vacio si no hay datos', (done) => {
    testing(`
      {
        drafts {
          id
          title
          text
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


  test('No debería registrar un post si no se pasan todos los datos necesarios', (done) => {
    testing(`
      mutation {
        createDraft (
          title: "Post title"
          user: userID
        ) {
          id
        }
      }
    `)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.success).toBeFalsy();
        done();
      });
  });


  test('No debería registrar un post si no se pasa un usuario registrado como autor', (done) => {
    testing(`
      mutation {
        createDraft (
          title: "Post title"
          text: "Post text"
          user: "noUserID"
        ) {
          id
        }
      }
    `)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.success).toBeFalsy();
        expect(response.errors).toContainObject({ message: 'You must provide a valid User' });
        done();
      });
  });


  test('Debería registrar un nuevo post', (done) => {
    testing(`
      mutation {
        createDraft (
          title: "Post title"
          text: "Post text"
          user: "${userID}"
        ) {
          id
        }
      }
    `)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.success).toBeTruthy();
        expect(response.data.createDraft.id).not.toBeNull();
        postID = response.data.createDraft.id;
        done();
      });
  });


  test('Debería devolver un array de borradores', (done) => {
    testing(`
      {
        drafts {
          id
          title
          text
          author {
            name
          }
        }
      }
    `)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.success).toBeTruthy();
        expect(response).toMatchObject({
          data: {
            drafts: [{
              id: postID,
              title: 'Post title',
              text: 'Post text',
              author: { name: 'John Doe' },
            }],
          },
        });
        done();
      });
  });


  test('Debería devolver los datos de un post', (done) => {
    testing(`
      {
        post (
          id:"${postID}"
        ) {
          id
          title
          text
          isPublished
          author {
            name
          }
        }
      }
    `)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.success).toBeTruthy();
        expect(response).toMatchObject({
          data: {
            post: {
              id: postID,
              title: 'Post title',
              text: 'Post text',
              isPublished: false,
              author: { name: 'John Doe' },
            },
          },
        });
        done();
      });
  });


  test('Debería publicarse un borrador', (done) => {
    testing(`
      mutation {
        publish (
          id:"${postID}"
        ) {
          id
          isPublished
        }
      }
    `)
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.success).toBeTruthy();
        expect(response.data.publish.isPublished).toBeTruthy();
        done();
      });
  });


  test('No debería editar un post si se elimina el título, texto o el autor', (done) => {
    testing(`
      mutation {
        updatePost (
          id: "${postID}"
          title: ""
          text: ""
          user: ""
        ) {
          id
          title
          text
          author {
            name
          }
        }
      }
    `)
      .then((response) => {
        console.log(response)
        expect(response.status).toBe(400);
        expect(response.success).toBeFalsy();
        done();
      });
  });


  test('Debería editar un post', (done) => {
    done();
  });


  test('Debería eliminar un post', (done) => {
    done();
  });
});
