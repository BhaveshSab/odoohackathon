import { Module } from '@nestjs/common';

import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';

/**
 * Maintenance management: repairs are routed through an approval gate before
 * work starts and drive the asset's status (UNDER_MAINTENANCE ↔ AVAILABLE).
 * PrismaService, ActivityService and NotificationsService come from their
 * @Global modules, so nothing extra needs importing here.
 */
@Module({
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
