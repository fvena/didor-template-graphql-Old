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
$ git clone --depth 1 https://github.com/fvena/didor-template-graphql myproject

# Reiniciar git
$ cd myproject
$ rm -rf .git
$ git init
```

##### 2. Define las variables de entorno
En el archivo `.env_example` tienes un ejemplo de las variables de entorno necesarias
para levantar el proyecto.

En principio esta configuración debería hacer funcionar tu proyecto, aunque te
recomiendo que modifiques el nombre de tu aplicación al menos.

```bash
# Copia en un nuevo archivo .env las variables de entorno
$ cp .env.example .env
```

##### 3. Configurando Dockers

> Este paso solo es necesario si es la primera vez que desarrollas de forma local
un proyecto con GraphQL y Prisma.

El siguiente paso será levantar los contenedores docker necesarios:

* __prisma-db__: Contenedor para la base de datos MySQL
* __prisma__: Contenedor con un servidor Prisma para comunicarse
con la base de datos.

> __Atención!__ Solo si quieres inicializar una instalación limpia puedes eliminar
los contenedores antiguos y las respectivas imágenes antes:

```bash
# Recuerda que esto eliminará los datos almacenados en las bases de datos

# Eliminar todos los contenedores e imágenes a la vez
$ docker stop $(docker ps -a -q)  // Para todos los contenedores
$ docker rm $(docker ps -a -q)    // Elimina todos los contenedores
$ docker rmi $(docker images -q)  // Elimina todas las imágenes

# Eliminar contenedores e imágenes de uno en uno
$ docker ps -a                        // Lista todos los contenedores
$ docker rm ID_or_Name1 ID_or_Name2   // Elimina los contenedores
$ docker images -a                    // Lista todas las imágenes
$ docker rmi Image1 Image2            // Elimina las imágenes

# Comprueba que se han eliminado correctamente
$ docker ps -a                        // Lista todos los contenedores
$ docker images -a                    // Lista todas las imágenes
```

Para levantar los contenedores primero necesitar haber definido la contraseña
de acceso de Prisma.

1. __Define la contraseña en docker compose__: Define tu contraseña en el
archivo `docker-compose.yml` en el campo `managementApiSecret`.

2. __Define la contraseña en tus variables de entorno__: Indica tu contraseña
elegida en el archivo `.env` en el campo `PRISMA_MANAGEMENT_API_SECRET`.


```bash
# Descarga las imágenes y levanta los contenedores
$ docker-compose up -d

# Comprueba que se han levantado los contendores prisma y prisma-db
$ docker ps -a
```

##### 4. Descarga las dependencias del proyecto
```bash
$ yarn install
```


##### 5. Crear la base de datos y arrancar el proyecto

El último paso es generar la base de datos y empezar a desarrollar.

Al generar la base de datos se creará una estructura basada en el esquema de datos
definido en el archivo `src/schemes/datamode.graphql`. Más adelante cuando lo modifiques
y crees tu propia estructura de datos, recuerda volver a ejecutar el comando
`prisma deploy` para actualizar los cambios en la base de datos.


```bash
# Genera/Modifica la base de datos
$ yarn deploy

# Inicia la plantilla en modo desarrollo
$ yarn dev
```

![](https://imgur.com/hElq68i.png)

## Estructura del proyecto

```bash
.
├── /src/                               
│   ├── /schemas/                           
│   │   ├── /post/                      # Type folder
│   │   │   ├── /post.document.md/      # Type documentation
│   │   │   ├── /post.mutation.js       # Mutation resolvers
│   │   │   ├── /post.query.js          # Query resolvers
│   │   │   ├── /post.schema.graphql    # GraphQL schema type definitions
│   │   │   └── /post.test.js           # Test type
│   │   └── ...
│   ├── /database/
│   │   ├── /post.graphql               # Post datamodel type definitions       
│   │   ├── /prisma.generated.graphql   # Prisma schema autogenerated file       
│   │   └── /prisma.generated.js        # Prisma databinding autogenerated file
│   ├── /utils/                         
│   │   ├── /merges.js                  # Herramientas para unir los resolvers y typedefs
│   │   └── /vars.js                    # Recoge las variables de entorno
│   └── /server.js                      # Configuración del servidor con graphql-yoga
│
├── .babelrc                            # Configuración de Babel
├── .editorconfig                       # ..
├── .env                                # ...
├── .env.example                        # ...
├── .env.test                           # ...
├── .eslintignore                       # ...
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
# Inicia tu servidor GraphQL en `http://localhost:4000` _y_ abre el Playground de GraphQL
$ yarn dev

# lint tu código con ESLint
$ yarn lint

# Iniciar los tests con Jest
$ yarn test

# Inicia lint y los tests
$ yarn validate

# Compila el proyecto en la carpeta build
$ yarn build

# Genera/Modifica la base de datos
$ yarn deploy

# Genera datos de prueba en la base de datos
$ yarn seed

# Genera y abre la documentación de la api
# yarn docs
```


#### Producción

```bash
# Muestra los logs en producción
# pm2 logs
```


## Inspiración

* [KunalKapadia/express-mongoose-es6-rest-api](https://github.com/KunalKapadia/express-mongoose-es6-rest-api)
* [danielfsousa/express-rest-es2017-boilerplate](https://github.com/danielfsousa/express-rest-es2017-boilerplate)

## License

[MIT License](README.md) - [Francisco Vena](https://github.com/fvena)
