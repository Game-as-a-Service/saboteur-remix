import { BadRequestException, UsePipes, applyDecorators } from '@nestjs/common';
import type { ZodSchema, ZodError } from 'zod';

/**
 * @param name Name of the exception
 * @returns Function to create a new BadRequestException
 */
export const ValidationFailedException =
  (name = 'Validation Failed') =>
  (error: ZodError) =>
    new BadRequestException({ ...error, name });

/**
 * @param schema Zod schema to validate against
 * @param onRejected Function to call when validation fails
 * @returns Decorator to apply to a controller method
 *
 * @example
 * @Validation(ZodSchema, (error) => new BadRequestException(error))
 * @Get()
 * get() {
 *   return 'Hello World';
 * }
 */
const Validation = (
  schema: ZodSchema,
  onRejected = ValidationFailedException(),
) =>
  applyDecorators(
    UsePipes({
      transform: (value) =>
        schema.parseAsync(value).catch((error) => {
          throw onRejected(error);
        }),
    }),
  );

export default Validation;
