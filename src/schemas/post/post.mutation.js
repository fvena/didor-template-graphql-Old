const Mutation = {};

Mutation.createDraft = async (parent, { title, text, user }, ctx, info) => {
  return ctx.db.mutation.createPost(
    {
      data: {
        title,
        text,
        isPublished: false,
        author: {
          connect: { id: user },
        },
      },
    },
    info,
  );
};

Mutation.publish = async (parent, { id }, ctx, info) => {
  return ctx.db.mutation.updatePost(
    {
      where: { id },
      data: { isPublished: true },
    },
    info,
  );
};

Mutation.deletePost = async (parent, { id }, ctx, info) => {
  return ctx.db.mutation.deletePost({ where: { id } }, info);
};


export { Mutation }; // eslint-disable-line
