import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { RecordStatus } from '@prisma/client';

/** Body for POST /org/departments (ADMIN only). */
export class CreateDepartmentDto {
  @IsString()
  @MinLength(2)
  name: string;

  /** User id of the department head (optional). */
  @IsOptional()
  @IsString()
  headId?: string;

  /** Parent department id (optional) — must not create a cycle. */
  @IsOptional()
  @IsString()
  parentDepartmentId?: string;

  @IsOptional()
  @IsEnum(RecordStatus)
  status?: RecordStatus;
}
