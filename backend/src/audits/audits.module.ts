import { Module } from '@nestjs/common';

import { AuditsController } from './audits.controller';
import { AuditsService } from './audits.service';

/** Feature 8 — Asset Audit. Wired into AppModule by the orchestrator. */
@Module({
  controllers: [AuditsController],
  providers: [AuditsService],
  exports: [AuditsService],
})
export class AuditsModule {}
