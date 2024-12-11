export enum SportCenterStatus {
  /** Centro deportivo en edicion, NO puede ser observado por usuarios comunes; SOLO EL MANAGER, 
   * hasta que este decida publicarlo
   */
  DRAFT = 'draft',
  PUBLISHED = 'published',
  BANNED = 'banned',
}