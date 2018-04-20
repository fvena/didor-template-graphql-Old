const Mutation = {};

Mutation.createDraft = (parent, { title, text }, ctx, info) => {
  return ctx.db.mutation.createPost(
    {
      data: {
        title,
        text,
      },
    },
    info,
  );
};

Mutation.addAuthor = (parent, { id, author }, ctx, info) => {
  return ctx.db.mutation.updatePost(
    {
      where: { id },
      data: { author },
    },
    info,
  );
};

Mutation.deletePost = (parent, { id }, ctx, info) => {
  return ctx.db.mutation.deletePost({ where: { id } }, info);
};

Mutation.publish = (parent, { id }, ctx, info) => {
  return ctx.db.mutation.updatePost(
    {
      where: { id },
      data: { isPublished: true },
    },
    info,
  );
};

export { Mutation }; // eslint-disable-line
