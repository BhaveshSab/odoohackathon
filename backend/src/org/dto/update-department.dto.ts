import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { RecordStatus } from '@prisma/client';

/** Body for PATCH /org/departments/:id (ADMIN only). All fields optional. */
export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  /**
   * User id of the department head. Pass null to clear the head.
   * (Nullability is handled in the service.)
   */
  @IsOptional()
  @IsString()
  headId?: string | null;

  @IsOptional()
  @IsString()
  parentDepartmentId?: string | null;

  @IsOptional()
  @IsEnum(RecordStatus)
  status?: RecordStatus;
}
