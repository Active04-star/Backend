export enum Sport_Center_Status {
  /**solamente el usuario que creo dicho sportcenter puede verlo, antes de publicarlo */
  DRAFT = 'draft',
  /**el centro ya esta activo */
  PUBLISHED = 'published',
  /**el centro fue desabilitado */
  DISABLE = 'disable',
  /**el centro fue baneado por un administrador */
  BANNED = 'banned',
}
