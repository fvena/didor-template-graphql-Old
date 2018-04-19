# Didor GraphQL Template

Plantilla/Starter Project para desarrollar servicios APIs con Node.js y GraphQL.

## Características


Node/Express template for building GraphQL APIs

* Sin transpilers, solo vanilla javascript.
* Últimas características ES2017 como Async/Await.
* CORS configurado.
* Express + MySQL ([mysql](https://github.com/mysqljs/mysql))
* Mantiene y define el estilos de codificación con [editorconfig](http://editorconfig.org).
* Utiliza [helmet](https://github.com/helmetjs/helmet) para definir algunas
cabeceras HTTP para la seguridad.
* Carga variables de entorno desde archivos .env con [dotenv](https://github.com/rolodato/dotenv-safe).
* Validación de las peticiones con [validator](https://www.npmjs.com/package/validator)
* Compresión Gzip con [compression](https://github.com/expressjs/compression).
* Linting con [eslint](http://eslint.org).
* Tests con [mocha](https://mochajs.org), [chai](http://chaijs.com) y [sinon](http://sinonjs.org).
* Code coverage con [istanbul](https://istanbul.js.org) and [coveralls](https://coveralls.io).
* Git hooks con [husky](https://github.com/typicode/husky).
* Logging con [morgan](https://github.com/expressjs/morgan).
* Integración continua con [gitLab](https://about.gitlab.com/features/gitlab-ci-cd/).


## Requerimientos
* [Node v7.6+](https://nodejs.org/en/download/current/)

## Empezando

Clona el repositorio y hazlo tuyo:

```bash
git clone --depth 1 https://github.com/fvena/didor-restful-mysql-boilerplate
cd didor-restful-mysql-boilerplate
rm -rf .git
```

Si es la primera aplicación que desarrollamos localmente con prisma, debemos crear los contenedores docker que necesita y generar la base de datos
```bash
prisma local start
prisma deploy
```

Instala las dependencias:

```bash
npm install
```

Define las variables de entorno:

```bash
cp .env.example .env
```

## Iniciarlo localmente

```bash
npm run dev
```

## Iniciarlo en desarrollo

```bash
npm run start
```

## Lint

```bash
# lint tu código con ESLint
npm run lint

# prueba a corregir los errores ESLint automaticamente
npm run lint:fix

# lint tu código mientras desarrollas
npm run lint:watch
```

## Test

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

## Validación

```bash
# Inicia lint y los tests
npm run validate
```

## Logs

```bash
# Muestra los logs en producción
pm2 logs
```

## Documentación

```bash
# Genera y abre la documentación de la api
npm run docs
```

## Desarrollo

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
