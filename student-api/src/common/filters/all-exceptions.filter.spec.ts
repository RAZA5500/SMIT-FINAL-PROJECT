import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AllExceptionsFilter } from './all-exceptions.filter';

function run(exception: unknown) {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const host = {
    switchToHttp: () => ({ getResponse: () => ({ status }) }),
  } as unknown as ArgumentsHost;
  new AllExceptionsFilter().catch(exception, host);
  return { status, body: json.mock.calls[0][0] as Record<string, unknown> };
}

describe('AllExceptionsFilter', () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  it('returns a generic 500 without stack or internal details', () => {
    const { status, body } = run(new Error('relation "users" does not exist'));
    expect(status).toHaveBeenCalledWith(500);
    expect(body).toEqual({
      statusCode: 500,
      message: 'Internal Server Error',
      error: 'Internal Server Error',
    });
    expect(body).not.toHaveProperty('stack');
  });

  it('maps Prisma P2002 → 409, P2003 → 400, P2025 → 404', () => {
    const prismaError = (code: string) =>
      new Prisma.PrismaClientKnownRequestError('db', {
        code,
        clientVersion: 'test',
      });
    expect(run(prismaError('P2002')).body.statusCode).toBe(409);
    expect(run(prismaError('P2003')).body.statusCode).toBe(400);
    expect(run(prismaError('P2025')).body.statusCode).toBe(404);
  });

  it('keeps validation messages as an array', () => {
    const { body } = run(
      new BadRequestException(['quantity must not be less than 1']),
    );
    expect(body).toEqual({
      statusCode: 400,
      message: ['quantity must not be less than 1'],
      error: 'Bad Request',
    });
  });

  it('normalises string HttpException responses to the same shape', () => {
    const { body } = run(new HttpException('Too Many Requests', 429));
    expect(body).toEqual({
      statusCode: 429,
      message: 'Too Many Requests',
      error: 'Too Many Requests',
    });
  });
});
