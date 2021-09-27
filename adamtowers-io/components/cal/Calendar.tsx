import { CSSProperties } from "react";
import range from "lodash/range";

import styles from "./Calendar.module.scss";
import classNames from "classnames";

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

type Event = {
  startTime: string;
  endTime: string;
};

type Props = {
  startDate: string;
  endDate: string;
  events: Event[];
};

function getDayDelta(start: string, end: string) {
  const startDate = new Date(start);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(end);
  endDate.setHours(0, 0, 0, 0);

  return Math.ceil((endDate.getTime() - startDate.getTime()) / MS_PER_DAY);
}

function msSinceDayStarted(ts: string): number {
  const date = new Date(ts);
  const startOfDay = new Date(ts);
  startOfDay.setHours(0, 0, 0, 0);
  return date.getTime() - startOfDay.getTime();
}

const Calendar: React.FC<Props> = ({ startDate, endDate, events }) => {
  const dateDelta = getDayDelta(startDate, endDate);
  const CalendarContainerStyles: CSSProperties = {
    display: "grid",
    gridTemplateRows: `60px repeat(${(24 - 7) * 4}, 5px)`, // 1 header + 24 hours
    gridRowGap: "0px",
    gridTemplateColumns: `repeat(${dateDelta}, 100px)`,
    gridColumnGap: "0px",
  };

  function constructDayColContainerStyles(idx: number): CSSProperties {
    return {
      gridRowStart: 1,
      gridRowEnd: (24 - 7) * 4 + 2,
      gridColumn: `${idx + 1}`,
    };
  }

  function constructDayDescStyles(date: Date, idx: number): CSSProperties {
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
    return (
      new Date(event.startTime).toDateString() ===
      new Date(event.endTime).toDateString()
    );
  });

  function constructEventStyles(event: Event): CSSProperties {
    const dayDelta = getDayDelta(startDate, event.startTime);

    return {
      gridColumn: dayDelta + 1,
      gridRowStart:
        Math.floor(msSinceDayStarted(event.startTime) / 1000 / 60 / 15) -
        7 * 4 +
        2,
      gridRowEnd:
        Math.ceil(msSinceDayStarted(event.endTime) / 1000 / 60 / 15) -
        7 * 4 +
        2,
    };
  }

  return (
    <div className={classNames(styles.container, "border")}>
      <div className={styles.yLabelsContainer}>
        {range(17).map((idx) => (
          <div key={idx} className={styles.hourRowLabel}>
            {HOUR_STRINGS[idx]}
          </div>
        ))}
      </div>
      <div className={styles.daysContainer}>
        <div style={CalendarContainerStyles}>
          {range(17).map((idx) => (
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
            const date = new Date(startDate);
            date.setDate(new Date(startDate).getDate() + delta);

            return (
              <div
                key={`desc-${idx}`}
                className={classNames(styles.dayDesc, "border-bottom")}
                style={constructDayDescStyles(date, idx)}
              >
                <div className={styles.dayDescMonth}>{`${
                  MONTHS[date.getMonth()]
                }. ${date.getDate()}`}</div>
                <div className={styles.dayDescDay}>{DAYS[date.getDay()]}</div>
              </div>
            );
          })}

          {drawableEvents.map((event, idx) => (
            <div
              key={event.startTime}
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
