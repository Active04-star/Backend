export class CreateRatingDto {
    readonly value: number;
    readonly userId: number;
    readonly targetId: number;
    readonly targetType: string; 
  }
  