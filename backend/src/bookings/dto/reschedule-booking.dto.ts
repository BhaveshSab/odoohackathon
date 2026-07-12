import { IsDateString } from 'class-validator';

/** Body for PATCH /bookings/:id/reschedule — move a booking to a new slot. */
export class RescheduleBookingDto {
  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
