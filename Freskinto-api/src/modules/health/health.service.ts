import { Injectable } from '@nestjs/common';
import { HealthDbService } from './health.db.service';
import { IHealthStatus } from './types/health.types';

@Injectable()
export class HealthService {
  constructor(private readonly healthDb: HealthDbService) {}

  async check(): Promise<IHealthStatus> {
    await this.healthDb.ping();
    return { status: 'ok', database: 'up' };
  }
}
