import { CSSProperties } from "react";
import range from "lodash/range";

import styles from "./Calendar.module.scss";
import classNames from "classnames";
import { YYYYMMDD } from "@/utils/YYYYMMDD";
import { Dayjs } from "dayjs";

const MS_PER_DAY = 1_000 * 60 * 60 * 24;
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const HOUR_STRINGS = [
  "12:00AM",
  "01:00AM",
  "02:00AM",
  "03:00AM",
  "04:00AM",
  "05:00AM",
  "06:00AM",
  "07:00AM",
  "08:00AM",
  "09:00AM",
  "10:00AM",
  "11:00AM",
  "12:00PM",
  "01:00PM",
  "02:00PM",
  "03:00PM",
  "04:00PM",
  "05:00PM",
  "06:00PM",
  "07:00PM",
  "08:00PM",
  "09:00PM",
  "10:00PM",
  "11:00PM",
];

export type Event = {
  startTime: Dayjs;
  endTime: Dayjs;
  id: string;
};

type Props = {
  startDate: YYYYMMDD;
  endDate: YYYYMMDD;
  events: Event[];
};

function getDayDelta(start: Dayjs, end: Dayjs) {
  return Math.floor(end.diff(start) / MS_PER_DAY);
}

function msSinceDayStarted(datetime: Dayjs): number {
  const startOfDay = new YYYYMMDD(datetime).toDayJs();
  return datetime.diff(startOfDay);
}

function getLocation(date: Dayjs) {
  const dateString = date.format('YYYY-MM-DD');

  if (dateString >= '2021-12-11' && dateString <= '2021-12-13') {
    return 'L.A.'
  }

  if (dateString >= '2021-12-14' && dateString <= '2021-12-16') {
    return 'San Francisco'
  }

  if (dateString >= '2021-12-11' && dateString <= '2021-12-29') {
    return 'San Jose'
  }

  return 'Seattle'
}

const Calendar: React.FC<Props> = ({ startDate, endDate, events }) => {
  const dateDelta = getDayDelta(startDate.toDayJs(), endDate.toDayJs()) + 1;
  const CalendarContainerStyles: CSSProperties = {
    display: "grid",
    gridTemplateRows: `60px repeat(${24 * 4}, 5px)`, // 1 header + 24 hours
    gridRowGap: "0px",
    gridTemplateColumns: `repeat(${dateDelta}, 100px)`,
    gridColumnGap: "0px",
  };

  function constructDayColContainerStyles(idx: number): CSSProperties {
    return {
      gridRowStart: 1,
      gridRowEnd: 24 * 4 + 2,
      gridColumn: `${idx + 1}`,
    };
  }

  function constructDayDescStyles(date: Dayjs, idx: number): CSSProperties {
    return {
      gridColumn: `${idx + 1}`,
    };
  }

  function constructHourRowContainerStyles(idx: number): CSSProperties {
    return {
      gridRow: `${idx * 4 + 2}`,
      gridColumnStart: 1,
      gridColumnEnd: dateDelta + 1,
    };
  }

  const drawableEvents = events.filter((event) => {
    const isInRange =
      startDate.isOnOrBefore(event.startTime) &&
      endDate.isOnOrAfter(event.endTime);
    const isSingleDayEvent = new YYYYMMDD(event.startTime).isSameDay(
      event.endTime
    );
    return isSingleDayEvent && isInRange;
  });

  function constructEventStyles(event: Event): CSSProperties {
    const dayDelta = getDayDelta(startDate.toDayJs(), event.startTime);

    return {
      gridColumn: dayDelta + 1,
      gridRowStart:
        Math.floor(msSinceDayStarted(event.startTime) / 1000 / 60 / 15) + 2,
      gridRowEnd:
        Math.ceil(msSinceDayStarted(event.endTime) / 1000 / 60 / 15) + 2,
    };
  }

  return (
    <div className={classNames(styles.container, "border")}>
      <div className={styles.yLabelsContainer}>
        {range(24).map((idx) => (
          <div key={idx} className={styles.hourRowLabel}>
            {HOUR_STRINGS[idx]}
          </div>
        ))}
      </div>
      <div className={styles.daysContainer}>
        <div style={CalendarContainerStyles}>
          {range(24).map((idx) => (
            <div
              key={idx}
              className={styles.hourRow}
              style={constructHourRowContainerStyles(idx)}
            ></div>
          ))}

          {range(dateDelta).map((idx) => (
            <div
              key={`col-${idx}`}
              className={styles.dayCol}
              style={constructDayColContainerStyles(idx)}
            ></div>
          ))}

          {range(dateDelta).map((delta, idx) => {
            const date = startDate.toDayJs().add(delta, "day");
            return (
              <div
                key={`desc-${idx}`}
                className={classNames(styles.dayDesc, "border-bottom")}
                style={constructDayDescStyles(date, idx)}
              >
                <div className={styles.dayDescDay}>{date.month() + 1}/{date.date()}, {date.format('ddd')}.</div>
                <div className={styles.dayDescDay}>{getLocation(date)}</div>
              </div>
            );
          })}

          {drawableEvents.map((event, idx) => (
            <div
              key={event.id || idx}
              className={classNames(styles.event, "hashed", "border")}
              style={constructEventStyles(event)}
              onClick={() => console.log(event)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
