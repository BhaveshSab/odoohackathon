import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { EmployeesService } from './employees.service';
import { ListEmployeesDto } from './dto/list-employees.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UpdateEmployeeRoleDto } from './dto/update-employee-role.dto';
import type { AuthUser } from '../auth/jwt.strategy';

@Controller('org/employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private readonly employees: EmployeesService) {}

  /** List employees — ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD. */
  @Get()
  @Roles(Role.ADMIN, Role.ASSET_MANAGER, Role.DEPARTMENT_HEAD)
  list(@Query() query: ListEmployeesDto) {
    return this.employees.list(query);
  }

  /** Employee detail — ADMIN, ASSET_MANAGER, DEPARTMENT_HEAD. */
  @Get(':id')
  @Roles(Role.ADMIN, Role.ASSET_MANAGER, Role.DEPARTMENT_HEAD)
  findOne(@Param('id') id: string) {
    return this.employees.findOne(id);
  }

  /** Update an employee's profile (ADMIN only). Never changes role. */
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.employees.update(user.id, id, dto);
  }

  /** Change an employee's role (ADMIN ONLY) — the only role-mutating route. */
  @Patch(':id/role')
  @Roles(Role.ADMIN)
  updateRole(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeRoleDto,
  ) {
    return this.employees.updateRole(user.id, id, dto);
  }
}
