const AuthPayload = {};

AuthPayload.user = async ({ user: { id } }, args, ctx, info) => {
  return ctx.db.query.user({ where: { id } }, info);
};

export default AuthPayload;
