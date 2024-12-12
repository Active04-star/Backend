import { Injectable } from "@nestjs/common";
import { Field_Repository } from "./field.repository";

@Injectable()
export class Field_Service{
    constructor(private readonly fieldRepository:Field_Repository){}



    
}