export interface ICreateAppointment {
  date: string;
  clinicalExam: string;
  patientDescription: string;
  imagePath?: string;
  patient: number;
  professional: number;
  clinic: number;
}
