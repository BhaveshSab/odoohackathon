import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MaintenancePriority } from '@prisma/client';

/** Body for POST /maintenance — raise a repair request against an asset. */
export class CreateMaintenanceDto {
  @IsString()
  assetId: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(MaintenancePriority)
  priority?: MaintenancePriority;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
