export enum SportCenterStatus {
  DRAFT = 'draft', //significa que el sportcenter todavia el usuario consumer no  va a poder ver este  porque esta en borrador,solamente el que lo este creando, falta asociar deportes canchas y fotos para que este pase a published
  PUBLISHED = 'published',
  DISABLE = 'disable',
  BANNED = 'banned',
}
