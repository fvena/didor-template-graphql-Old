# Didor GraphQL Template

Plantilla/Starter para desarrollar servicios APIs con Node.js y GraphQL.

## Características


Plantilla desarrollada con Node y Express para construir APIs con GraphQL.

* Utiliza la próxima generación de Javascript con [Babel](https://babeljs.io).
* Últimas características ES2017 como Async/Await.
* CORS configurado.
* Express + MySQL ([mysql](https://github.com/mysqljs/mysql))
* Mantiene y define el estilos de codificación con [editorconfig](http://editorconfig.org).
* Utiliza [helmet](https://github.com/helmetjs/helmet) para definir algunas
cabeceras HTTP para la seguridad.
* Carga variables de entorno desde archivos .env con [dotenv](https://github.com/rolodato/dotenv-safe).
* Validación de las peticiones con [validator](https://www.npmjs.com/package/validator)
* Compresión Gzip con [compression](https://github.com/expressjs/compression).
* Linting con [eslint](http://eslint.org) (_airbnb-base_).
* Tests con [mocha](https://mochajs.org), [chai](http://chaijs.com) y [sinon](http://sinonjs.org).
* Code coverage con [istanbul](https://istanbul.js.org) and [coveralls](https://coveralls.io).
* Git hooks con [husky](https://github.com/typicode/husky).
* Logging con [morgan](https://github.com/expressjs/morgan).
* Integración continua con [gitLab](https://about.gitlab.com/features/gitlab-ci-cd/).

* __Servidor GraphQL escalable:__ El servidor utiliza
[`graphql-yoga`](https://github.com/prisma/graphql-yoga) basado en Apollo Server
y Express.
* __GraphQL database:__ Incluye GraphQL database binding to [Prisma](https://www.prismagraphql.com) (utiliza MySQL)
* __Tooling__: Soporte Out-of-the-box para [GraphQL Playground](https://github.com/prisma/graphql-playground) & [seguimiento de las consultas](https://github.com/apollographql/apollo-tracing)
* __Extensible__: [Modelo de datos](./database/datamodel.graphql) simple y flexible, fácil de ajustar y extender.
* __Configuración sencilla__: Configuración preconfigurada [`graphql-config`](https://github.com/prisma/graphql-config)

Visite [How to GraphQL](https://www.howtographql.com/graphql-js/0-introduction/)
para ver un tutorial bastante completo de __GraphQL & Node.js__. También Puede
aprender más sobre como desarrollar un servidor con esta plantilla [aquí](https://blog.graph.cool/graphql-boilerplates-graphql-create-how-to-setup-a-graphql-project-6428be2f3a5).


## Requerimientos Previos
Para poder utilizar esta plantilla necesitarás tener instaladas las siguientes
herramientas:

* [Node v7.6+](https://nodejs.org/en/download/current/)
* [Docker.io](https://www.docker.com/community-edition#/download)
* [Yarn](https://yarnpkg.com/lang/en/docs/install/)

## Empezando

##### 1. Clona el repositorio y hazlo tuyo

El primer paso será descargarte el proyecto.

Cuando se haya descargado, entra dentro del directorio donde se haya clonado,
elimina la carpeta `.git` e inicia un repo nuevo. Ahora tendrás un repositorio
limpio y listo para tu proyecto, sin los commits que he realizado durante el
desarrollo de esta plantilla.

```bash
# Clonar el repositorio
$ git clone --depth 1 https://github.com/fvena/didor-restful-mysql-boilerplate

# Reiniciar git
$ cd didor-restful-mysql-boilerplate
$ rm -rf .git
$ git init
```

##### 2. Configurando tu entorno de Desarrollo

> Este paso solo es necesario si es la primera vez que desarrollas de forma local
un proyecto con GraphQL y Prisma.

El siguiente paso será instalar de forma global el cli de Prisma para que nos
descarguará las imágenes de los Docker necesarios y los levantará:

* _prisma-db_: Contenedor para la base de datos MySQL
* *local_prisma-database_1*: Contenedor con un servidor Prisma para comunicarse
con la base de datos.

```bash
# Instalamos de forma global Prisma y GraphQL
$ yarn global add prisma

# Descargamos y levantamos los contenedores
$ prisma local start

# Comprueba que ambos se han descargado y levantado correctamente
$ docker ps
```

##### 3. Descarga las dependencias del proyecto
```bash
$ yarn install
```

##### 4. Define las variables de entorno+
En el archivo `.env_example` tienes un ejemplo de las variables de entorno necesarias
para levantar el proyecto.

En principio esta configuración debería hacer funcionar tu proyecto, aunque te
recomiendo que modifiques el nombre de tu aplicación al menos.

```bash
# Copia en un nuevo archivo .env las variables de entorno
$ cp .env_example .env
```

##### 5. Crear la base de datos y arrancar el proyecto

El último paso es generar la base de datos y empezar a desarrollar.

Al generar la base de datos se creará una estructura basada en el esquema de datos
definido en el archivo `src/api/datamode.graphql`. Más adelante cuando lo modifiques
y crees tu propia estructura de datos, recuerda volver a ejecutar el comando
`prisma deploy` para actualizar los cambios en la base de datos.


```bash
# Genera/Modifica la base de datos
$ prisma deploy

# Inicia la plantilla en modo desarrollo
$ yarn dev
```

![](https://imgur.com/hElq68i.png)

## Estructura del proyecto

```bash
.
├── /src/                               
│   ├── /api/                           
│   │   ├── /post/                      # Type folder
│   │   │   ├── /post.datamodel.graphql # Prisma datamodel type definitions
│   │   │   ├── /post.document.md/      # Type documentation
│   │   │   ├── /post.mutation.js       # Mutation resolvers
│   │   │   ├── /post.query.js          # Query resolvers
│   │   │   ├── /post.schema.graphql    # GraphQL schema type definitions
│   │   │   └── /post.test.js           # Test type
│   │   └── ...
│   ├── /generated/                     
│   │   └── /prisma.graphql             # Prisma autogenerated file
│   ├── /utils/                         
│   │   └── /merges.js                  # Herramientas para unir los resolvers y typedefs
│   └── /server.js                      # Configuración del servidor con graphql-yoga
│
├── .babelrc                            # Configuración de Babel
├── .editorconfig                       # ..
├── .env_example                        # ...
├── .eslintrc                           # ...
├── .gitignore                          # ...
├── .graphqlconfig.yml                  # ...
├── .prisma.yml                         # ...
├── CHANGELOG.md                        # ...
├── LICENSE                             # ...
├── package.json                        # ...
├── README.md                           # ...
└── yarn.lock                           # ...
```


## Comandos

#### Desarrollo

```bash
# Inicia tu servidor GraphQL en `http://localhost:4000`
$ yarn start

# Inicia tu servidor GraphQL en `http://localhost:4000` _y_ abre el Playground de GraphQL
$ yarn dev

# Abre el Playground de GraphQL
$ yarn playground
```

#### Lint

```bash
# lint tu código con ESLint
npm run lint

# prueba a corregir los errores ESLint automaticamente
npm run lint:fix

# lint tu código mientras desarrollas
npm run lint:watch
```

#### Test

```bash
# Iniciar todos los tests con Mocha
npm run test

# Inicia los test unitarios
npm run test:unit

# Inicia los test de integración
npm run test:integration

# Inicia todos los test mientras desarrollas
npm run test:watch

# Muestra un informe con la covertura de los test
npm run coverage
```

#### Validación

```bash
# Inicia lint y los tests
npm run validate
```

#### Logs

```bash
# Muestra los logs en producción
pm2 logs
```

#### Documentación

```bash
# Genera y abre la documentación de la api
npm run docs
```

## Producción

Define la ip de tu servidor:

```bash
DEPLOY_SERVER=127.0.0.1
```


Inicia el script de desarrollo:

```bash
npm run deploy
or
sh ./deploy.sh
```

## Inspiración

* [KunalKapadia/express-mongoose-es6-rest-api](https://github.com/KunalKapadia/express-mongoose-es6-rest-api)
* [danielfsousa/express-rest-es2017-boilerplate](https://github.com/danielfsousa/express-rest-es2017-boilerplate)

## License

[MIT License](README.md) - [Francisco Vena](https://github.com/fvena)
