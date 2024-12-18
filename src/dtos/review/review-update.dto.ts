import { PickType } from "@nestjs/swagger";
import { reviewCreate } from "./review-create.dto";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class reviewUpdate extends PickType(reviewCreate, ["comment", "rating"]) { 
        @IsNotEmpty()
        @IsString()
        @IsUUID()
        reviewId: string
}