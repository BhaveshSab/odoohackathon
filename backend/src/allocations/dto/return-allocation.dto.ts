import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AssetCondition } from '@prisma/client';

/** Body for POST /allocations/:id/return — the check-in step. */
export class ReturnAllocationDto {
  @IsOptional()
  @IsString()
  checkInNotes?: string;

  @IsOptional()
  @IsEnum(AssetCondition)
  conditionOnReturn?: AssetCondition;
}
