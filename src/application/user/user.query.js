import { getUserId } from '../../utils/auth';

const Query = {};

Query.users = (parent, args, ctx, info) => {
  return ctx.db.query.users({}, info);
};

Query.user = (parent, { id }, ctx, info) => {
  return ctx.db.query.user({ where: { id } }, info);
};

Query.me = (parent, args, ctx, info) => {
  const id = getUserId(ctx);
  return ctx.db.query.user({ where: { id } }, info);
};


export { Query }; // eslint-disable-line
