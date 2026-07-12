import { Module } from '@nestjs/common';

import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';

/**
 * Feature 4 — Asset Registration & Directory.
 * PrismaService, ActivityService and NotificationsService are provided by
 * their @Global modules, so no imports are needed here.
 */
@Module({
  controllers: [AssetsController],
  providers: [AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}
