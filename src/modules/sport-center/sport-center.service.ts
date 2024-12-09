import { Injectable } from "@nestjs/common";
import { SportCenterRepository } from "./sport-center.repository";

@Injectable()
export class SportCenterService{
    constructor(private readonly sportcenterRepository:SportCenterRepository){}

}