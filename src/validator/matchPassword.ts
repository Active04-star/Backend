/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({name: "MatchPassword", async: false})
export class MatchPassword implements ValidatorConstraintInterface {

    validate(password: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        return password !== (validationArguments.object as any)[validationArguments.constraints[0]]? false : true;
    }

    defaultMessage?(validationArguments?: ValidationArguments): string {
        return "(MatchPassword ValidatorConstraint) Passwords don't match!";
    }

}