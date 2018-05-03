const Mutation = {};

Mutation.createDraft = async (parent, { title, text, user }, ctx, info) => {
  const existUser = await ctx.db.exists.User({ id: user });

  if (!existUser) {
    throw new Error('You must provide a valid User');
  }

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


Mutation.updatePost = async (parent, { id, title, text, user }, ctx, info) => {
  if (user && user !== '') {
    const existUser = await ctx.db.exists.User({ id: user });

    if (!existUser) {
      throw new Error('You must provide a valid User');
    }
  }


  return ctx.db.mutation.updatePost(
    {
      where: { id },
      data: {
        title,
        text,
        author: {
          connect: { id: user },
        },
      },
    },
    info,
  );
};


Mutation.deletePost = async (parent, { id }, ctx, info) => {
  return ctx.db.mutation.deletePost({ where: { id } }, info);
};


export { Mutation }; // eslint-disable-line
