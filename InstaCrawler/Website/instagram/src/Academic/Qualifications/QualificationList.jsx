import React from "react";
import QualificationItem from "./QualificationItem";

function QualificationList({ qualifications, style }) {
  return qualifications.map((qualification) => (
    <QualificationItem
      key={qualification.id}
      qualification={qualification}
      style={style}
    />
  ));
}

export default QualificationList;
