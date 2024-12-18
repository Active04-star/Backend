export enum SubscriptionStatus {
  NOTHING = 'nothing',
  PENDING = 'PENDING', // En proceso de activación
  ACTIVE = 'ACTIVE', // Activa
  EXPIRED = 'EXPIRED', // Venció la suscripción
  CANCELLED = 'CANCELLED', // Cancelada manualmente
  SUSPENDED = 'SUSPENDED', // Por pagos fallidos
}
