import { Module } from '@nestjs/common';

import { AllocationsController } from './allocations.controller';
import { AllocationsService } from './allocations.service';

/**
 * Feature 5 — Allocation & Transfer.
 * PrismaModule, ActivityModule and NotificationsModule are all @Global, so we
 * only need to register this feature's own controller + service here.
 */
@Module({
  controllers: [AllocationsController],
  providers: [AllocationsService],
  exports: [AllocationsService],
})
export class AllocationsModule {}
