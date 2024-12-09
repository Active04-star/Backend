import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SportCenter } from "src/entities/sportcenter.entity";
import { Repository } from "typeorm";

@Injectable()
export class SportCenterRepository{
    constructor(
        @InjectRepository(SportCenter)
        private sportCenterRepository:Repository<SportCenter>
){}



}