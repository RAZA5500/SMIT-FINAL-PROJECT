import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthDbService } from './health.db.service';
import { HealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService, HealthDbService],
})
export class HealthModule {}
