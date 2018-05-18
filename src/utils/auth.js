import jwt from 'jsonwebtoken';
import { APP_SECRET } from './vars';

class AuthError extends Error {
  constructor() {
    super('Not authorized');
  }
}


function getUserId(ctx) {
  const Authorization = ctx.request.get('Authorization');

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw new AuthError();
}


function getUser(ctx) {
  const userID = getUserId(ctx);

  return ctx.db.query.user({ where: { id: userID } });
}


function getTypeId(source, ctx) {
  if (source && source.id) {
    return source.id;
  }

  if (ctx.request.body.variables) {
    return ctx.request.body.variables.id;
  }

  return null;
}

module.exports = {
  getUser,
  getUserId,
  getTypeId,
  AuthError,
};
