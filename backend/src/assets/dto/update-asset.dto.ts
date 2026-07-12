import { AssetCondition, AssetStatus } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

/**
 * Body for PATCH /assets/:id. Edits descriptive fields. `status` may only be
 * moved to a terminal/administrative state here (RETIRED, DISPOSED, LOST) —
 * the workflow-owned states (ALLOCATED, UNDER_MAINTENANCE, RESERVED) are
 * rejected by the service.
 */
export class UpdateAssetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  serialNumber?: string;

  @IsOptional()
  @IsDateString()
  acquisitionDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  acquisitionCost?: number;

  @IsOptional()
  @IsEnum(AssetCondition)
  condition?: AssetCondition;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsArray()
  documents?: unknown[];

  @IsOptional()
  @IsBoolean()
  isBookable?: boolean;

  @IsOptional()
  @IsObject()
  customFieldValues?: Record<string, unknown>;

  @IsOptional()
  @IsEnum(AssetStatus)
  status?: AssetStatus;
}
