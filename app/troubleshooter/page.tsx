const TroubleshootPage = async () => {
  const res = await fetch(
    `${process.env.CALENDAR_SYNC_WEB_URL}/api/apps/calendar/events/list`,
  );

  const { events } = await res.json();
  console.log({ events });
  return (
    <div>
      <h1>Troubleshooter</h1>

      <div>
        <h2>Events</h2>
        {events?.map((event) => (
          <div key={event.id}>{event.summary}</div>
        ))}
      </div>
    </div>
  );
};

export default TroubleshootPage;
