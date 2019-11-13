import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from './entity/room.entity';
import { Repository } from 'typeorm';
import RoomDto from './dto/room.dto';
import ICrudService from '../../../base/crud.interface.service';
import { RoomAttributeEntity } from '../attributes/entity/roomAttribute.entity';

@Injectable()
export class RoomsService implements ICrudService<RoomDto> {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {
  }

  public async deleteItems(teamId: string, ids: number[]): Promise<boolean> {
    await this.roomRepository.delete(ids);
    return true;
  }

  public async getAll(teamId: string): Promise<RoomDto[]> {
    const rooms = await this.roomRepository.find({
      relations: ['attributes', 'attributes.attributeType'],
      where: [{ teamId }],
    });
    return rooms.map(entity => entity.toDto());
  }

  public async getById(teamId: string, id: number): Promise<RoomDto> {
    const room = await this.roomRepository.findOne({
      relations: ['attributes', 'attributes.attributeType'],
      where: [{ id, team: { id: teamId } }],
    });
    if (room) {
      return room.toDto();
    } else {
      throw new HttpException('Item not found', 404);
    }
  }

  public async deleteById(teamId: string, roomId: number): Promise<boolean> {
    await this.roomRepository.delete({ id: roomId, team: { id: teamId } });
    return true;
  }

  public async add(teamId: string, roomDto: RoomDto): Promise<RoomDto> {
    const newRoom = new RoomEntity();
    newRoom.teamId = teamId;
    newRoom.id = roomDto.id;
    newRoom.name = roomDto.name;
    newRoom.image = roomDto.image;
    newRoom.color = roomDto.color;
    if (roomDto.attributes) {
      newRoom.attributes = roomDto.attributes.map(attr =>
        RoomAttributeEntity.fromDto(attr),
      );
    }

    const insertedRoom = await this.roomRepository.save(newRoom);
    return insertedRoom.toDto();
  }
}

