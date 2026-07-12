import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivityModule } from './activity/activity.module';
import { AllocationsModule } from './allocations/allocations.module';
import { AssetsModule } from './assets/assets.module';
import { AuditsModule } from './audits/audits.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrgModule } from './org/org.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    // Loads .env and makes ConfigService available everywhere.
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    // Cross-cutting, @Global — available to every feature module.
    ActivityModule,
    NotificationsModule,
    AuthModule,
    // Feature modules.
    OrgModule, // #3 Organization setup
    AssetsModule, // #4 Asset registration & directory
    AllocationsModule, // #5 Allocation & transfer
    BookingsModule, // #6 Resource booking
    MaintenanceModule, // #7 Maintenance
    AuditsModule, // #8 Audit cycles
    ReportsModule, // #2 + #9 Dashboard & reports
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
