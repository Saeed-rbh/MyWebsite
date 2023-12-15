import React from "react";
import { saveAs } from "file-saver";

class AddToCalendar extends React.Component {
  createICSFile() {
    const title = "Saeed Arabha's Birthday";
    const description = "Saeedarabha.com";
    const startDate = "19950215T000000Z"; // UTC time
    const endDate = "19950216T000000Z"; // UTC time

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    saveAs(blob, "SaeedArabhasBirthday.ics");
  }

  render() {
    return (
      <h1 style={{ marginRight: "15px" }}>
        Date of birth: <a onClick={() => this.createICSFile()}>15.02.1995</a>
      </h1>
    );
  }
}

export default AddToCalendar;
