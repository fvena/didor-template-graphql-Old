import { getUserId } from '../../utils/auth';

const Query = {};

Query.feed = (parent, args, ctx, info) => {
  return ctx.db.query.posts({ where: { isPublished: true } }, info);
};

Query.drafts = (parent, args, ctx, info) => {
  const userID = getUserId(ctx);

  const where = {
    isPublished: false,
    author: {
      id: userID,
    },
  };

  return ctx.db.query.posts({ where }, info);
};

Query.post = (parent, { id }, ctx, info) => {
  return ctx.db.query.post({ where: { id } }, info);
};

export { Query }; // eslint-disable-line
