import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

/** Body for POST /audits/:id/auditors. */
export class AssignAuditorsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  auditorIds: string[];
}
