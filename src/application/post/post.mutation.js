import { getUserId } from '../../utils/auth';
import validate from '../../utils/validate';

const Mutation = {};

Mutation.createDraft = async (parent, { title, text }, ctx, info) => {
  const userID = getUserId(ctx);

  const fields = [
    { name: 'title', value: title, validate: ['required', 'noEmpty'] },
    { name: 'text', value: text, validate: ['required', 'noEmpty'] },
  ];

  await validate(fields);

  return ctx.db.mutation.createPost(
    {
      data: {
        title,
        text,
        isPublished: false,
        author: {
          connect: { id: userID },
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


Mutation.updatePost = async (parent, { id, title, text }, ctx, info) => {
  const fields = [
    { name: 'title', value: title, validate: ['noEmpty'] },
    { name: 'text', value: text, validate: ['noEmpty'] },
  ];

  await validate(fields);

  return ctx.db.mutation.updatePost(
    {
      where: { id },
      data: {
        title,
        text,
      },
    },
    info,
  );
};


Mutation.deletePost = async (parent, { id }, ctx, info) => {
  return ctx.db.mutation.deletePost({ where: { id } }, info);
};


Mutation.addPostAuthor = async (parent, { id, user }, ctx, info) => {
  return ctx.db.mutation.updatePost(
    {
      where: { id },
      data: {
        author: {
          connect: { id: user },
        },
      },
    },
    info,
  );
};


Mutation.deletePostAuthor = async (parent, { id, user }, ctx, info) => {
  return ctx.db.mutation.updatePost(
    {
      where: { id },
      data: {
        author: {
          delete: { id: user },
        },
      },
    },
    info,
  );
};


Mutation.likePost = async (parent, { id }, ctx, info) => {
  const userID = getUserId(ctx);

  return ctx.db.mutation.updatePost(
    {
      where: { id },
      data: {
        likedBy: {
          connect: { id: userID },
        },
      },
    },
    info,
  );
};


Mutation.dislikePost = async (parent, { id }, ctx, info) => {
  const userID = getUserId(ctx);

  return ctx.db.mutation.updatePost(
    {
      where: { id },
      data: {
        likedBy: {
          delete: { id: userID },
        },
      },
    },
    info,
  );
};


export { Mutation }; // eslint-disable-line
