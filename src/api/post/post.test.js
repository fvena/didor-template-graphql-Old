import { tester } from 'graphql-tester';

const testing = tester({
  url: `http://localhost:${process.env.APP_PORT}/`,
});

describe('post resolvers', () => {
  test('drafts query', (done) => {
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
        console.log(response);
        expect(response.status).toBe(200);
        expect(response.success).toBeTruthy();
        expect(response).toMatchObject({
          data: {
            drafts: [
              {
                id: 'cjgb85rye000p08586gn84k5l',
                title: 'post1',
                text: 'texto 1',
                author: 'Pepe',
              },
              {
                id: 'cjgb85xy9000s0858wdh4cvjy',
                title: 'post2',
                text: 'texto 2',
                author: 'Pepe',
              },
              {
                id: 'cjgb862g3000v08586iktgfti',
                title: 'post3',
                text: 'texto 3',
                author: 'Pepe',
              },
              {
                id: 'cjgb867hp000y0858x4cz05y6',
                title: 'post4',
                text: 'texto 4',
                author: 'Pipo',
              },
              {
                id: 'cjgb86bk400110858lby7v0wh',
                title: 'post5',
                text: 'texto 5',
                author: 'Pipo',
              },
            ],
          },
        });
        done();
      });
  });
});
