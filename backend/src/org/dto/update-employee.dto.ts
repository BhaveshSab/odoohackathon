import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { RecordStatus } from '@prisma/client';

/**
 * Body for PATCH /org/employees/:id (ADMIN only).
 * NOTE: role is intentionally NOT here — role changes go through the dedicated
 * PATCH /org/employees/:id/role endpoint.
 */
export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  /** Move the employee to a department. Pass null to unassign. */
  @IsOptional()
  @IsString()
  departmentId?: string | null;

  @IsOptional()
  @IsEnum(RecordStatus)
  status?: RecordStatus;
}
