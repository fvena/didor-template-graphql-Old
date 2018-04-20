const Query = {
  feed(parent, args, ctx, info) {
    return ctx.db.query.posts({ where: { isPublished: true } }, info);
  },
  drafts(parent, args, ctx, info) {
    return ctx.db.query.posts({ where: { isPublished: false } }, info);
  },
  post(parent, { id }, ctx, info) {
    return ctx.db.query.post({ where: { id } }, info);
  },
};

export { Query }; // eslint-disable-line
