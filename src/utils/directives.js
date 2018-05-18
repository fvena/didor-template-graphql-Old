import { getUser, getUserId, getTypeId } from './auth';

const Directive = {};

async function checkIsOwner(type, userID, typeID, ctx) {
  // Si el tipo que estamos comprobando es del tipo usuario
  // la id del tipo Usuario debería ser igual a la id del usuario
  if (type === 'User' && userID === typeID) {
    return true;
  }

  // Compruebo si el nodo "typeID" del tipo "type"
  // su author es "userID"
  return ctx.db.exists[type]({ id: typeID, author: { id: userID } });
}


Directive.isAuthenticated = async (next, source, args, ctx) => {
  getUserId(ctx);
  return next();
};


Directive.hasRole = async (next, source, { roles }, ctx) => {
  const { role } = await getUser(ctx);

  if (roles.includes(role)) {
    return next();
  }

  throw new Error('Unauthorized, incorrect role');
};


Directive.isOwner = async (next, source, { type }, ctx) => {
  const userID = getUserId(ctx);
  const typeID = getTypeId(source, ctx);
  const isOwner = await checkIsOwner(type, userID, typeID, ctx);

  if (isOwner) {
    return next();
  }

  throw new Error('Unauthorized, must be owner');
};


Directive.isOwnerOrHasRole = async (next, source, { roles, type }, ctx) => {
  const { role, id: userID } = getUser(ctx);
  const typeID = getTypeId(source, ctx);

  if (roles.includes(role)) {
    return next();
  }

  const isOwner = await checkIsOwner(type, userID, typeID, ctx);

  if (isOwner) {
    return next();
  }

  throw new Error('Unauthorized, not owner or incorrect role');
};

export default Directive;
