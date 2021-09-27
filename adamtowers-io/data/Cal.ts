import { calendar_v3 as GoogleCalendar } from "@googleapis/calendar";

const CALENDARS = ["adam.towers77@gmail.com", "adam@towers.email"];

let googleCal: GoogleCalendar.Calendar | null = null;
function initGoogleCalApi() {
    if (!googleCal) {
        googleCal = new GoogleCalendar.Calendar({
            auth: process.env.GCAL_KEY,
        });
    }
}

export async function getEvents(): Promise<GoogleCalendar.Schema$Event[]> {
    initGoogleCalApi();

    const startDate = new Date();
    // add some padding so client in any tz always has today full
    startDate.setDate(startDate.getDate() - 1);
    const timeMin = startDate.toISOString();
    const endDate = new Date();
    // next 3 weeks plus a bit of padding for tz
    endDate.setDate(endDate.getDate() + 21 + 1);
    const timeMax = endDate.toISOString();

    const calendarRequests = CALENDARS.map(async cal => {
        const eventsList = await googleCal.events.list({
            calendarId: cal,
            singleEvents: true,
            timeMin,
            timeMax,
        })
        return eventsList.data.items;
    })

    console.info(`Getting events from ${timeMin} to ${timeMax}`);

    const events = (await Promise.all(calendarRequests)).flat();

    return events;
}
