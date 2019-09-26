import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from './entity/room.entity';
import { Repository } from 'typeorm';
import RoomDto from './dto/room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  public async getAll(teamId: string): Promise<RoomDto[]> {
    const rooms = await this.roomRepository.find({ team: { id: teamId } });
    return rooms.map(entity => this.convertEntityToDto(entity));
  }

  public async getById(roomId: number, teamId: string): Promise<RoomDto> {
    const room = await this.roomRepository.findOne({
      id: roomId,
      team: { id: teamId },
    });
    if (room) {
      return this.convertEntityToDto(room);
    } else {
      throw new HttpException('Item not found', 404);
    }
  }

  public async add(roomDto: RoomDto, teamId: string): Promise<RoomDto> {
    const newRoom = new RoomEntity();
    newRoom.teamId = teamId;
    newRoom.name = roomDto.name;
    newRoom.image = roomDto.image;
    const insertedRoom = await this.roomRepository.save(newRoom);
    return this.convertEntityToDto(insertedRoom);
  }

  private convertEntityToDto(entity: RoomEntity): RoomDto {
    const dto = new RoomDto();
    dto.id = entity.id;
    dto.image = entity.image;
    dto.name = entity.name;
    return dto;
  }
}
