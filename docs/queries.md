# Queries

Las _Queries_ son las preguntas que hacemos a la base de datos para obtener datos.
Para interaccionar con la base de datos, utilizaremos la API de Prisma, que se ha
generado a partir del modelo de datos que hemos definido `src/database/datamode.graphql`.

> Para explorar las operaciones que podemos realizar con el API de Prisma de nuestro
  servicio, puedes usar la documentación generada en el _GraphQL Playground_.

A continuación, veremos ejemplos de queries utilizando el servicio de Prisma
basado en el siguiente modelo de datos:

```graphql
type Post {
  id: ID! @unique
  title: String!
  published: Boolean!
  author: User!
}

type User {
  id: ID! @unique
  age: Int
  email: String! @unique
  name: String!
  accessRole: AccessRole
  posts: [Post!]!
}

enum AccessRole {
  USER
  ADMIN
}
```
