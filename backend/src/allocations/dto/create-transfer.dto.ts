import { IsOptional, IsString } from 'class-validator';

/**
 * Body for POST /transfers.
 * Exactly one of toUserId / toDepartmentId must be supplied — enforced in the
 * service.
 */
export class CreateTransferDto {
  @IsString()
  assetId: string;

  @IsOptional()
  @IsString()
  toUserId?: string;

  @IsOptional()
  @IsString()
  toDepartmentId?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
