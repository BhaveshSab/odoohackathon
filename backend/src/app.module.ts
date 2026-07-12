import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // Loads .env and makes ConfigService available everywhere.
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    // More feature modules (org, assets, ...) get added here as we build them.
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
