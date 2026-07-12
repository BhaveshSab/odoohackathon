import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ActivityService } from './activity.service';

/** Feature 10 — the full audit log of admin/manager/employee actions. */
@Controller('activity')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivityController {
  constructor(private readonly activity: ActivityService) {}

  @Get()
  @Roles(Role.ADMIN, Role.ASSET_MANAGER)
  list(
    @Query('take') take?: string,
    @Query('skip') skip?: string,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('actorId') actorId?: string,
  ) {
    return this.activity.list({
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
      entityType,
      entityId,
      actorId,
    });
  }
}
