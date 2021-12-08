import dayjs, { Dayjs } from "dayjs";

export function isSameDay(datetime1: Dayjs, datetime2: Dayjs) {
  return (
    datetime1.date() === datetime2.date() &&
    datetime1.month() === datetime2.month() &&
    datetime1.year() === datetime2.year()
  );
}

function dayJsify(day: YYYYMMDD | Dayjs) {
  if (day instanceof YYYYMMDD) {
    day.toDayJs();
  } else {
    return day;
  }
}

export class YYYYMMDD {
  private datetime: Dayjs;

  constructor(datetime: Dayjs) {
    this.datetime = datetime
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0);
  }

  toDayJs() {
    return this.datetime;
  }

  isSameDay(other: YYYYMMDD | Dayjs) {
    return isSameDay(this.datetime, dayJsify(other));
  }

  isOnOrAfter(other: YYYYMMDD | Dayjs) {
    if (this.isSameDay(other)) {
      return true;
    } else {
      return this.datetime.isAfter(dayJsify(other));
    }
  }

  isOnOrBefore(other: YYYYMMDD | Dayjs) {
    if (this.isSameDay(other)) {
      return true;
    } else {
      return this.datetime.isBefore(dayJsify(other));
    }
  }
}
