import { IsOptional, IsString } from 'class-validator';

/** Body for POST /maintenance/:id/resolve — optional notes on how it was fixed. */
export class ResolveMaintenanceDto {
  @IsOptional()
  @IsString()
  resolutionNotes?: string;
}
