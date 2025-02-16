import { fromZonedTime } from "date-fns-tz";

interface TimeZone {
  date: Date | string;
  timeZone?: string;
}

/**
 * update dates in UTC timezone
 * @param date: Date
 * @param timeZone?: string
 * @returns Date
 */
export const setTimeZone = ({ date, timeZone = "Asia/Kolkata" }: TimeZone) => {
  const options = { timeZone, hour12: false };
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dateTime = new Date(date);
  const utcDate = fromZonedTime(dateTime, userTimeZone);

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
export const isStreakContinues = (date1: Date, date2: Date): boolean => {
  const lastLog = setTimeZone({ date: date1 });
  const current = setTimeZone({ date: date2 });

  const diffTime = current.getTime() - lastLog.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays === 1;
};
