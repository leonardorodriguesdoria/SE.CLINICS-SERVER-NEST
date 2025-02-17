export class AppointmentNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppointmentNotFoundException';
  }
}
