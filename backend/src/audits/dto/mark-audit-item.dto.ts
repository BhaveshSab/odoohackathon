import { AuditResult } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

/**
 * Body for PATCH /audits/:id/items/:itemId. Only VERIFIED | MISSING | DAMAGED
 * are meaningful marks; PENDING is rejected by the service (BadRequest).
 */
export class MarkAuditItemDto {
  @IsEnum(AuditResult)
  result: AuditResult;

  @IsOptional()
  @IsString()
  notes?: string;
}
