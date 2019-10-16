import RoomDto from '../booking/meetingRooms/rooms/dto/room.dto';

export default interface ICrudService<DTO> {
  getAll(teamId: string): Promise<DTO[]>;
  getById(teamId: string, id: number): Promise<DTO>;
  deleteById(teamId: string, id: number): Promise<boolean>;
  deleteItems(teamId: string, id: number[]): Promise<boolean>;
  add(teamId: string, dto: DTO): Promise<DTO>;
}
