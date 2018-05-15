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

module.exports = {
  getUserId,
  AuthError,
};
