export enum SportCenterStatus {
  DRAFT = 'draft', //solamente el usuario , que creo dicho sportcenter puede verlo, antes de publicarlo
  PUBLISHED = 'published', //el centro ya esta activo
  DISABLE = 'disable', //el centro fue desabilitado
  BANNED = 'banned', //el centro fue baneado por admin
}
