import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import type { Response } from 'express';

import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ReportQueryDto } from './dto/report-query.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  /** KPI cards — available to any authenticated user. */
  @Get('dashboard')
  dashboard() {
    return this.reports.dashboard();
  }

  /** Most-used vs idle assets. */
  @Get('asset-utilization')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSET_MANAGER)
  assetUtilization(@Query() query: ReportQueryDto) {
    return this.reports.assetUtilization(query.limit);
  }

  /** Maintenance request counts by asset and by category. */
  @Get('maintenance-frequency')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSET_MANAGER)
  maintenanceFrequency() {
    return this.reports.maintenanceFrequency();
  }

  /** Assets due for maintenance or nearing retirement. */
  @Get('due-maintenance')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSET_MANAGER)
  dueMaintenance() {
    return this.reports.dueMaintenance();
  }

  /** Currently-allocated asset counts per department. */
  @Get('department-allocation')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSET_MANAGER)
  departmentAllocation() {
    return this.reports.departmentAllocation();
  }

  /** Peak booking windows by day-of-week and hour. */
  @Get('booking-heatmap')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSET_MANAGER)
  bookingHeatmap() {
    return this.reports.bookingHeatmap();
  }

  /** Asset list as downloadable CSV text. */
  @Get('export/assets.csv')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSET_MANAGER)
  async exportAssetsCsv(@Res({ passthrough: true }) res: Response) {
    const csv = await this.reports.assetsCsv();
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="assets.csv"');
    return csv;
  }
}
