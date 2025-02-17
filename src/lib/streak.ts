import { fromZonedTime } from "date-fns-tz";

interface TimeZone {
  date: Date | string;
  timeZone?: string | null;
}

/**
 * update dates in UTC timezone
 * @param date: Date
 * @param timeZone?: string
 * @returns Date
 */
export const setTimeZone = ({ date, timeZone }: TimeZone) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dateTime = new Date(date);
  const utcDate = fromZonedTime(dateTime, timeZone ?? userTimeZone);

  return utcDate;

  //   dateTime.setHours(dateTime.getHours() + 5);
  //   dateTime.setMinutes(dateTime.getMinutes() + 30);
};

/**
 * check if user has logged yesterday: streak continues/not
 * @param lastLogDate: date1
 * @param currentDate: date2
 * @returns boolean: `true if streak continues, false if not`
 */
export const isStreakContinues = (
  date1: Date,
  date2: Date,
  timeZone?: string | null,
): boolean => {
  const lastLog = setTimeZone({ date: date1, timeZone });
  const current = setTimeZone({ date: date2, timeZone });
  current;

  // Subtract 1 day from current date
  current.setDate(current.getDate() - 1);

  return (
    lastLog.getDate() === current.getDate() &&
    lastLog.getMonth() === current.getMonth() &&
    lastLog.getFullYear() === current.getFullYear()
  );
};
