import * as React from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import '../../variables/calendar.scss' // webpack must be configured to do this

export default class BookingSchedulePage extends React.Component {
  public render() {
    return (
      <div>
        <FullCalendar defaultView="dayGridMonth" plugins={[dayGridPlugin]} />
      </div>
    );
  }
}
