import { IsDateString, IsOptional, IsString } from 'class-validator';

/** Body for POST /bookings — reserve a bookable asset for a time slot. */
export class CreateBookingDto {
  @IsString()
  assetId: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsString()
  purpose?: string;
}
