import { Patient } from "./patient";
import { Medecin } from "./medecin";
import { Pharmacist } from "./pharmacist"
;
export interface Prescription {
  id: number;
  patientId: number;
  medecinId: number;
  pharmacistId: number;
  dateIssued: Date;
  medications: number[];
  patient?: Patient;
  medecin?: Medecin;
  pharmacist?: Pharmacist;
}