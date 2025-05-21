import { parse, format, formatDistanceToNow, differenceInDays } from "date-fns";

// convert time stamp to distance.
// if time difference < 7 day, show the distance to now.
// if more than 7 day, show the date and time
export const convertTimeToDistance = (timestamp) => {
  const parsedTime = parse(timestamp, "HH:mm:ss dd/MM/yyyy", new Date());

  // check how many days
  const now = new Date();
  const days = differenceInDays(now, parsedTime);

  if (days >= 7) {
    return format(parsedTime, "yyyy-MM-dd HH:mm");
  } else {
    return formatDistanceToNow(parsedTime, { addSuffix: true });
  }
};