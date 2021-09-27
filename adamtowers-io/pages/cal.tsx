import { GetStaticProps } from "next";
import type { calendar_v3 as GoogleCalendar } from "@googleapis/calendar";

import { getEvents } from "data/Cal";

import SingleColumn from "@/components/layout/SingleColumn";
import Calendar from "@/components/cal/Calendar";

export const getStaticProps: GetStaticProps = async () => {
  const events = await getEvents();

  return {
    props: {
      events,
    },
  };
};

type Props = {
  events: GoogleCalendar.Schema$Event[];
};

export default function Cal({ events }: Props) {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 21);

  const mappedEvents = events.map((event) => ({
    startTime: event.start.dateTime,
    endTime: event.end.dateTime,
  }));

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
