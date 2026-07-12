import { IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

/** Body for PATCH /org/employees/:id/role (ADMIN only). */
export class UpdateEmployeeRoleDto {
  @IsEnum(Role)
  role: Role;
}
