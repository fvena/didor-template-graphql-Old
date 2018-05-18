import bcrypt from 'bcryptjs';

const Mutation = {};

Mutation.createUser = async (parent, args, ctx, info) => {
  const password = await bcrypt.hash(args.password, 10);
  return ctx.db.mutation.createUser({
    data: { ...args, password },
  });
};

Mutation.updateUser = async (parent, { id, email, name, role }, ctx, info) => {
  return ctx.db.mutation.updateUser(
    {
      where: { id },
      data: { email, name, role },
    },
    info,
  );
};

Mutation.deleteUser = async (parent, { id }, ctx, info) => {
  return ctx.db.mutation.deleteUser({ where: { id } }, info);
};


export { Mutation }; // eslint-disable-line
