import { IsString } from 'class-validator';

/** Body for POST /maintenance/:id/assign — name the technician taking the job. */
export class AssignMaintenanceDto {
  @IsString()
  technicianName: string;
}
