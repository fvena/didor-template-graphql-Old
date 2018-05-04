const Mutation = {};

Mutation.addComment = async (parent, { text, userID, postID }, ctx, info) => {
  return ctx.db.mutation.createComment(
    {
      data: {
        text,
        commentBy: {
          connect: { id: userID },
        },
        post: {
          connect: { id: postID },
        },
      },
    },
    info,
  );
};


Mutation.deleteComment = async (parent, { id }, ctx, info) => {
  return ctx.db.mutation.deleteComment({ where: { id } }, info);
};


export { Mutation }; // eslint-disable-line
