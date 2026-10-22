import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';
import { STATUS_CODES } from 'http';

export interface IErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

const PRISMA_ERRORS: Record<string, IErrorResponse> = {
  P2002: {
    statusCode: HttpStatus.CONFLICT,
    message: 'Unique constraint violation',
    error: 'Conflict',
  },
  P2003: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Invalid foreign key reference',
    error: 'Bad Request',
  },
  P2025: {
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Record not found',
    error: 'Not Found',
  },
};

/**
 * Har exception ko ek hi JSON shape `{ statusCode, message, error }` mein badalta hai.
 * Stack trace aur SQL kabhi client ko nahi jate — sirf server log (FLOW-MD 09 §3.1).
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const body = this.toResponse(exception);
    response.status(body.statusCode).json(body);
  }

  private toResponse(exception: unknown): IErrorResponse {
    if (exception instanceof HttpException) {
      return this.fromHttpException(exception);
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const mapped = PRISMA_ERRORS[exception.code];
      if (mapped) return mapped;
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid data provided',
        error: 'Bad Request',
      };
    }

    this.logger.error(
      exception instanceof Error
        ? (exception.stack ?? exception.message)
        : String(exception),
    );
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
      error: 'Internal Server Error',
    };
  }

  private fromHttpException(exception: HttpException): IErrorResponse {
    const statusCode = exception.getStatus();
    const defaultError = STATUS_CODES[statusCode] ?? 'Error';
    const response = exception.getResponse();

    if (typeof response === 'string') {
      return { statusCode, message: response, error: defaultError };
    }

    const { message, error } = response as {
      message?: string | string[];
      error?: string;
    };
    return {
      statusCode,
      message: message ?? exception.message,
      error: error ?? defaultError,
    };
  }
}
