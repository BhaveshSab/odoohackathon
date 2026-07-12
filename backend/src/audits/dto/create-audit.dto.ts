import { IsDateString, IsOptional, IsString } from 'class-validator';

/**
 * Body for POST /audits. Creates an OPEN cycle and auto-generates an AuditItem
 * (result PENDING) for every in-scope asset. Scope is department and/or
 * location over a date range (see AuditsService.createCycle for the rules).
 */
export class CreateAuditDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  scopeDepartmentId?: string;

  @IsOptional()
  @IsString()
  scopeLocation?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
