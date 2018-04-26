const Mutation = {};

/**
 * CreateDraft Mutation
 * Crea un Post sin publicar (borrador)
 *
 * @param  {string} title Título del Post
 * @param  {string} text  Texto del Post
 * @return {Post}         Datos del Post añadido
 */
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


/**
 * AddAuthor Mutation
 * Añade un autor a un Post
 *
 * @param  {string} id      Id del Post
 * @param  {string} author  Autor del Post
 * @return {Post}           Datos del Post afectado
 */
Mutation.addAuthor = (parent, { id, author }, ctx, info) => {
  return ctx.db.mutation.updatePost(
    {
      where: { id },
      data: { author },
    },
    info,
  );
};


/**
 * DeletePost Mutation
 * Devuelve un listado con todos los Post publicados
 *
 * @param  {string} id      Id del Post
 * @return {Post}           Datos del Post eliminado
 */
Mutation.deletePost = (parent, { id }, ctx, info) => {
  return ctx.db.mutation.deletePost({ where: { id } }, info);
};


/**
 * Publish Mutation
 * Devuelve un listado con todos los Post publicados
 *
 * @param {string} id      Id del Post
 * @return {Post}           Datos del Post afectado
 */
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
