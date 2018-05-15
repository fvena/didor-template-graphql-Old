import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../../utils/vars';

const Mutation = {};

Mutation.signup = async (parent, args, ctx, info) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await ctx.db.mutation.createUser({
    data: { ...args, password },
  });

  return {
    token: jwt.sign({ userId: user.id }, APP_SECRET),
    user,
  };
};

Mutation.login = async (parent, { email, password }, ctx, info) => {
  const user = await ctx.db.query.user({ where: { email } });
  if (!user) {
    throw new Error(`No such user found for email: ${email}`);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  return {
    token: jwt.sign({ userId: user.id }, APP_SECRET),
    user,
  };
};

export { Mutation }; // eslint-disable-line
