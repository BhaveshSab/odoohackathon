import { BookingStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

/** Query filters for GET /bookings (calendar / list view). */
export class QueryBookingsDto {
  @IsOptional()
  @IsString()
  assetId?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  /** Date range (calendar view): only bookings overlapping [from, to). */
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  /** When true, only the current user's own bookings. */
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  mine?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
