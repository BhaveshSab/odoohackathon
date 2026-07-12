import { Module } from '@nestjs/common';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

/**
 * Feature 3 — Organization Setup.
 * Master data everything else depends on: Departments, Asset Categories, and
 * the Employee Directory (the User table). The ONLY place roles are assigned.
 * PrismaService, ActivityService and NotificationsService are all @Global, so
 * they need no explicit import here.
 */
@Module({
  controllers: [
    DepartmentsController,
    CategoriesController,
    EmployeesController,
  ],
  providers: [DepartmentsService, CategoriesService, EmployeesService],
})
export class OrgModule {}
