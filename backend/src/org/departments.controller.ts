import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';

import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { ListDepartmentsDto } from './dto/list-departments.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import type { AuthUser } from '../auth/jwt.strategy';

@Controller('org/departments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DepartmentsController {
  constructor(private readonly departments: DepartmentsService) {}

  /** Create a department (ADMIN only). */
  @Post()
  @Roles(Role.ADMIN)
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateDepartmentDto) {
    return this.departments.create(user.id, dto);
  }

  /** List departments — any authenticated user. */
  @Get()
  list(@Query() query: ListDepartmentsDto) {
    return this.departments.list(query);
  }

  /** Department detail — any authenticated user. */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departments.findOne(id);
  }

  /** Edit a department (ADMIN only). */
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
  ) {
    return this.departments.update(user.id, id, dto);
  }
}
