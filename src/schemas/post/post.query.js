const Query = {};

/**
 * Feed Query
 * Devuelve un listado con todos los Post publicados
 *
 * @return {Post}       Listado de Post
 */
Query.feed = (parent, args, ctx, info) => {
  return ctx.db.query.posts({ where: { isPublished: true } }, info);
};


/**
 * Drafts Query
 * Devuelve un listado con todos los Post no publicados (borradores).
 *
 * @return {Post}       Listado de Post
 */
Query.drafts = (parent, args, ctx, info) => {
  return ctx.db.query.posts({ where: { isPublished: false } }, info);
};


/**
 * Post Query
 * Devuelve todos los datos de un Post
 *
 * @param  {id}   id    Id del Post
 * @return {Post}       Datos del Post
 */
Query.post = (parent, { id }, ctx, info) => {
  return ctx.db.query.post({ where: { id } }, info);
};


export { Query }; // eslint-disable-line
