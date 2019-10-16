import { HttpException, Injectable } from '@nestjs/common';
import ICrudService from '../../../base/crud.interface.service';
import { RoomAttributeDto } from './dto/roomAttribute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomAttributeEntity } from './entity/roomAttribute.entity';
import { RoomEntity } from '../rooms/entity/room.entity';
import { RoomAttributeTypeEntity } from '../attributeTypes/entity/room.attributeType.entity';

@Injectable()
export class RoomAttributeService implements ICrudService<RoomAttributeDto> {
  constructor(
    @InjectRepository(RoomAttributeEntity)
    private readonly roomAttributeRepository: Repository<RoomAttributeEntity>,
    @InjectRepository(RoomAttributeTypeEntity)
    private readonly roomAttributeTypeRepository: Repository<
      RoomAttributeTypeEntity
    >,
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  public async add(
    teamId: string,
    dto: RoomAttributeDto,
  ): Promise<RoomAttributeDto> {
    const findedRoom = await this.roomRepository.findOne({
      teamId,
      id: dto.room.id,
    });
    if (!findedRoom) {
      throw new HttpException('Переговорка не найдена', 404);
    }
    const findedAttributeType = await this.roomAttributeTypeRepository.findOne({
      teamId,
      id: dto.attributeType.id,
    });
    if (!findedAttributeType) {
      throw new HttpException('Тип атрибута не найден', 404);
    }
    const newAttribute = new RoomAttributeEntity();
    newAttribute.attributeType = findedAttributeType;
    newAttribute.room = findedRoom;
    newAttribute.value = dto.value;
    const result = await this.roomAttributeRepository.save(newAttribute);
    return result.toDto();
  }

  public async deleteById(teamId: string, id: number): Promise<boolean> {
    await this.roomAttributeRepository.delete({ id });
    return true;
  }

  public async getAll(teamId: string): Promise<RoomAttributeDto[]> {
    const result = await this.roomAttributeRepository.find();
    return result.map(entity => entity.toDto());
  }

  public async getById(teamId: string, id: number): Promise<RoomAttributeDto> {
    const result = await this.roomAttributeRepository.findOne(
      { id },
      { relations: ['attributeType', 'room'] },
    );
    if (result) {
      return result.toDto();
    } else {
      return null;
    }
  }

  deleteItems(teamId: string, id: number[]): Promise<boolean> {
    return undefined;
  }
}
