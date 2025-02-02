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
 * @param lastLogDate
 * @param currentDate
 * @returns boolean: `true if streak continues, false if not`
 */
export const isStreakContinues = (
  lastLogDate: Date,
  currentDate: Date,
): boolean => {
  const lastLog = setTimeZone({ date: lastLogDate });
  const current = setTimeZone({ date: currentDate });

  const diffTime = current.getTime() - lastLog.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays <= 1;
};
