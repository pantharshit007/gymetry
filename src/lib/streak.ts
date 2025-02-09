interface TimeZone {
  date: Date;
  timeZone?: string;
}

/**
 * update dates in IST (default) timezone
 * @param date: Date
 * @param timeZone: string
 * @returns Date
 */
export const setTimeZone = ({ date, timeZone = "Asia/Kolkata" }: TimeZone) => {
  const options = { timeZone, hour12: false };
  const dateTimeString = date.toLocaleString("en-US", options);
  const dateTime = new Date(dateTimeString);
  return dateTime;
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
