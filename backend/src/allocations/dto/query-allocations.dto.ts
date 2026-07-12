import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { AllocationStatus } from '@prisma/client';

/** Query filters for GET /allocations. All optional. */
export class QueryAllocationsDto {
  @IsOptional()
  @IsString()
  assetId?: string;

  @IsOptional()
  @IsString()
  holderUserId?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsEnum(AllocationStatus)
  status?: AllocationStatus;

  // Query strings arrive as "true"/"false"; coerce to a real boolean.
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  overdue?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number;
}
