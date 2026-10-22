import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { BCRYPT_COST } from '../../common/constants';

@Injectable()
export class PasswordService {
  /** Login mein user na mile tab bhi bcrypt chalta hai — response time se email ka pata na chale */
  private dummyHash?: Promise<string>;

  hash(password: string): Promise<string> {
    return hash(password, BCRYPT_COST);
  }

  /** `passwordHash` null ho (user nahi mila) to bhi compare karke `false` deta hai */
  async verify(
    password: string,
    passwordHash: string | null | undefined,
  ): Promise<boolean> {
    if (!passwordHash) {
      this.dummyHash ??= hash('dummy-password-for-timing', BCRYPT_COST);
      await compare(password, await this.dummyHash);
      return false;
    }
    return compare(password, passwordHash);
  }
}
