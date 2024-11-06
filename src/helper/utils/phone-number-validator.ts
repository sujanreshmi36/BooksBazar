import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'contact', async: false })
export class PhoneNumberValidator implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        if (typeof value !== 'string') {
            return false;
        }
        return /^(98|97|96|95)\d{7}$/.test(value);
    }

    defaultMessage(args: ValidationArguments) {
        return 'Invalid phone number format';
    }
}