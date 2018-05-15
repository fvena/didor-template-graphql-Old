const Mutation = {};

Mutation.createUser = async (parent, { email, name }, ctx, info) => {
  return ctx.db.mutation.createUser(
    {
      data: { email, name },
    },
    info,
  );
};

Mutation.updateUser = async (parent, { id, email, name }, ctx, info) => {
  return ctx.db.mutation.updateUser(
    {
      where: { id },
      data: { email, name },
    },
    info,
  );
};

Mutation.deleteUser = async (parent, { id }, ctx, info) => {
  return ctx.db.mutation.deleteUser({ where: { id } }, info);
};


export { Mutation }; // eslint-disable-line
