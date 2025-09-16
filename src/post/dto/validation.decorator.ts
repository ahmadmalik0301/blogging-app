import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function MaxWords(max: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'maxWords',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [max],
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          const words = value.trim().split(/\s+/);
          return words.length <= args.constraints[0];
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must not exceed ${args.constraints[0]} words`;
        },
      },
    });
  };
}

export function MinWords(min: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'minWords',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [min],
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          const words = value.trim().split(/\s+/);
          return words.length >= args.constraints[0];
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must have at least ${args.constraints[0]} words`;
        },
      },
    });
  };
}
