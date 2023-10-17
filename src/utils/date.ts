import { differenceInDays } from 'date-fns';

export function isDateGreaterThanOrEqualOneDay(inputDate: Date): boolean {
  const currentDate = new Date();

  // differenceInDays will return the difference between the two dates in days.
  // If the inputDate is in the future compared to currentDate, the result will be negative.
  // If the inputDate is in the past compared to currentDate, the result will be positive.
  const daysDifference = differenceInDays(currentDate, inputDate);

  return daysDifference >= 1;
}
