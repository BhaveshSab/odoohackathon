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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ListCategoriesDto } from './dto/list-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { AuthUser } from '../auth/jwt.strategy';

@Controller('org/categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  /** Create an asset category (ADMIN only). */
  @Post()
  @Roles(Role.ADMIN)
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateCategoryDto) {
    return this.categories.create(user.id, dto);
  }

  /** List categories — any authenticated user. */
  @Get()
  list(@Query() query: ListCategoriesDto) {
    return this.categories.list(query);
  }

  /** Category detail — any authenticated user. */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categories.findOne(id);
  }

  /** Edit a category (ADMIN only). */
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categories.update(user.id, id, dto);
  }
}
