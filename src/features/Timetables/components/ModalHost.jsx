import React from "react";
import ModalToast from "./modals/ModalToast";
import ModalTimetableForm from "./modals/ModalTimetableForm";
import ModalEntryForm from "./modals/ModalEntryForm";
import ModalWeeks from "./modals/ModalWeeks";
import ModalGenerateSessions from "./modals/ModalGenerateSessions";
import ModalCellDetails from "./modals/ModalCellDetails";

export default function ModalHost(props) {
  const { modal } = props;
  switch (modal.type) {
    case "toast":
      return <ModalToast {...props} />;
    case "ttForm":
      return <ModalTimetableForm {...props} />;
    case "entryForm":
      return <ModalEntryForm {...props} />;
    case "weeks":
      return <ModalWeeks {...props} />;
    case "generateSessions":
      return <ModalGenerateSessions {...props} />;
    case "cellDetails":
      return <ModalCellDetails {...props} />;
    default:
      return null;
  }
}
