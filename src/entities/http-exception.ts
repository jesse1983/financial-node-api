import { ZodError } from 'zod';

export class SimpleException extends Error {
  message: string;
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}

export class HttpException extends SimpleException {
  status: number;
  message: string;
  errors: unknown;
  constructor(status: number, message: string, errors?: unknown) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}

export class RecordNotFoundException extends HttpException {
  constructor(id: unknown) {
    super(404, `Record with id ${id} not found`);
  }
}

export class ValidationRecordException extends HttpException {
  constructor(err: unknown) {
    if (err instanceof ZodError) {
      super(400, 'Error body object', err.format());
    }
  }
}
