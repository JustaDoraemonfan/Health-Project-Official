import PatientForm from "./PatientForm";
import DoctorForm from "./DoctorForm";
import FrontlineWorkerForm from "./FrontlineWorkerForm";
import AdminForm from "./AdminForm";

export const roleFormComponents = {
  patient: PatientForm,
  doctor: DoctorForm,
  frontlineWorker: FrontlineWorkerForm,
  admin: AdminForm,
};

export { PatientForm, DoctorForm, FrontlineWorkerForm, AdminForm };
