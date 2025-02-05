import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';

@Injectable()
export class TimeService {
  private readonly timezone: string;

  constructor() {
    this.timezone = process.env.TIME_ZONE || 'Asia/Dhaka';
  }

  getCurrentTime(): moment.Moment {
    return moment().tz(this.timezone);
  }

  getEndOfDay(): moment.Moment {
    return this.getCurrentTime().endOf('day');
  }

  getTimezone(): string {
    return this.timezone;
  }


  // Get the start of the current day in the set timezone
  getStartOfDay(): moment.Moment {
    return this.getCurrentTime().startOf('day');
  }

  // Convert a given time to the set timezone
  convertToTimezone(date: string | Date, fromTimezone: string): moment.Moment {
    return moment.tz(date, fromTimezone).tz(this.timezone);
  }

  // Format a given date in the set timezone
  formatDate(date: string | Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    return moment.tz(date, this.timezone).format(format);
  }

  // Get the difference between two dates in a specific unit (e.g., hours, days)
  getTimeDifference(
    date1: string | Date,
    date2: string | Date,
    unit: moment.unitOfTime.Diff = 'seconds',
  ): number {
    return moment(date1).diff(moment(date2), unit);
  }

  // Check if a date is before the current time in the set timezone
  isBeforeNow(date: string | Date): boolean {
    return moment.tz(date, this.timezone).isBefore(this.getCurrentTime());
  }

  // Check if a date is after the current time in the set timezone
  isAfterNow(date: string | Date): boolean {
    return moment.tz(date, this.timezone).isAfter(this.getCurrentTime());
  }

  // Add a specific amount of time to the current time
  addTime(amount: number, unit: moment.unitOfTime.DurationConstructor): moment.Moment {
    return this.getCurrentTime().add(amount, unit);
  }

  // Subtract a specific amount of time from the current time
  subtractTime(amount: number, unit: moment.unitOfTime.DurationConstructor): moment.Moment {
    return this.getCurrentTime().subtract(amount, unit);
  }

  // Get a list of available timezones
  getAvailableTimezones(): string[] {
    return moment.tz.names();
  }

  // Check if a given timezone is valid
  isValidTimezone(timezone: string): boolean {
    return moment.tz.zone(timezone) !== null;
  }

  // Get the current time in UTC
  getCurrentTimeInUTC(): moment.Moment {
    return moment().utc();
  }

  // Convert time from one timezone to another
  convertBetweenTimezones(
    date: string | Date,
    fromTimezone: string,
    toTimezone: string,
  ): moment.Moment {
    return moment.tz(date, fromTimezone).tz(toTimezone);
  }
}
