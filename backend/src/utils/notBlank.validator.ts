import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({name: 'IsNotBlank', async: false})
export class IsNotBlankConstraint implements ValidatorConstraintInterface {
    validate(value: any, validationArguments: ValidationArguments): boolean | Promise<boolean> {
        return(typeof(value) === 'string' && value.trim().length > 0);
    }
    defaultMessage(validationArguments: ValidationArguments): string {
        return `${validationArguments.property} should not be blank`;
    }
}

export function IsNotBlank(validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsNotBlankConstraint,
        });
    }
}