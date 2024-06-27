import {
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    // Only validate if the type is not custom
    if (metadata.type !== 'custom') {
      try {
        return this.schema.parse(value);
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors = error.errors.map((err) => ({
            path: err.path,
            message:
              err.code === 'unrecognized_keys'
                ? `Invalid keys: ${err.keys.join(', ')}`
                : err.message,
          }));

          throw new BadRequestException({
            statusCode: 400,
            message: 'Validation failed',
            errors: formattedErrors,
            error: true,
          });
        }
        throw new BadRequestException('Validation failed');
      }
    }
    return value;
  }
}
