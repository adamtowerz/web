import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import type { calendar_v3 as GoogleCalendar } from "@googleapis/calendar";
import dayjs from "dayjs";

import { getEvents } from "data/Cal";

import SingleColumn from "@/components/layout/SingleColumn";
import { YYYYMMDD } from "@/utils/YYYYMMDD";

const Calendar = dynamic(() => import("@/components/cal/Calendar"), {
  ssr: false,
});

export const getStaticProps: GetStaticProps = async () => {
  const events = await getEvents();

  return {
    props: {
      events,
    },
    revalidate: 2 * 60,
  };
};

type Props = {
  events: GoogleCalendar.Schema$Event[];
};

export default function Cal({ events }: Props) {
  const periodStartDate: YYYYMMDD = new YYYYMMDD(dayjs());
  const periodEndDate: YYYYMMDD = new YYYYMMDD(
    periodStartDate.toDayJs().add(21, "day")
  );

  console.log('ending on', periodEndDate.toDayJs().format())

  const mappedEvents = [];
  events.forEach((event) => {
    if (event?.start?.dateTime && event?.end?.dateTime) {
      mappedEvents.push({
        startTime: dayjs(event.start.dateTime),
        endTime: dayjs(event.end.dateTime),
        id: event.id,
      });
      if (event.id === '6vdu2evnfjp3jc5ae9rnc9v0jv_20211228T190000Z') {
        console.log(event)
      }
    }
  });

  return (
    <SingleColumn header footer>
      <Calendar
        startDate={periodStartDate}
        endDate={periodEndDate}
        events={mappedEvents}
      />
    </SingleColumn>
  );
}
