import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import type { calendar_v3 as GoogleCalendar } from "@googleapis/calendar";

import { getEvents } from "data/Cal";

import SingleColumn from "@/components/layout/SingleColumn";

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
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 21);

  const mappedEvents = [];
  events.forEach((event) => {
    if (event?.start?.dateTime && event?.end?.dateTime) {
      mappedEvents.push({
        startTime: event.start.dateTime,
        endTime: event.end.dateTime,
      });
    }
  });

  return (
    <SingleColumn header footer>
      <Calendar
        startDate={startDate.toDateString()}
        endDate={endDate.toDateString()}
        events={mappedEvents}
      />
    </SingleColumn>
  );
}
