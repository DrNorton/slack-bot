export default interface AppointmentDto {
  id: number;
  roomId: number;
  title: string;
  desc: string;
  start: Date;
  end: Date;
}
