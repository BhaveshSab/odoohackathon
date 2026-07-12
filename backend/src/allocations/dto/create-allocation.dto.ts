import { IsOptional, IsString, IsDateString } from 'class-validator';

/**
 * Body for POST /allocations.
 * Exactly one of holderUserId / departmentId must be supplied — enforced in the
 * service (a "one-of" rule is awkward to express purely with class-validator).
 */
export class CreateAllocationDto {
  @IsString()
  assetId: string;

  @IsOptional()
  @IsString()
  holderUserId?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsDateString()
  expectedReturnDate?: string;
}
