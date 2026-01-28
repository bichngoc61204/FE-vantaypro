
import React from 'react';
import ModalToast from "./ModalToast";
import ModalLevelForm from "./forms/ModalLevelForm";
import ModalGradeForm from "./forms/ModalGradeForm";
import ModalYearForm from "./forms/ModalYearForm";
import ModalSubjectForm from "./forms/ModalSubjectForm";
import ModalRoleForm from "./forms/ModalRoleForm";
import ModalConfigForm from "./forms/ModalConfigForm";

const ModalHost = (props) => {
  const { modal } = props;
  switch (modal.type) {
    case "toast":
      return <ModalToast modal={modal} onClose={props.onClose} />;
    case "levelForm":
      return <ModalLevelForm {...props} />;
    case "gradeForm":
      return <ModalGradeForm {...props} />;
    case "yearForm":
      return <ModalYearForm {...props} />;
    case "subjectForm":
      return <ModalSubjectForm {...props} />;
    case "roleForm":
      return <ModalRoleForm {...props} />;
    case "configForm":
      return <ModalConfigForm {...props} />;
    default:
      return null;
  }
};

export default ModalHost;
