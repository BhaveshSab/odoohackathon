import { AssetCondition } from '@prisma/client';
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

/** Body for POST /assets. Registers a new asset; assetTag is auto-generated. */
export class CreateAssetDto {
  @IsString()
  name: string;

  @IsString()
  categoryId: string;

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

  // list of { name, url } — stored as Json.
  @IsOptional()
  @IsArray()
  documents?: unknown[];

  @IsOptional()
  @IsBoolean()
  isBookable?: boolean;

  // per-asset values for the category's custom field definitions — stored as Json.
  @IsOptional()
  @IsObject()
  customFieldValues?: Record<string, unknown>;
}
