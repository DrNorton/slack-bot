import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomAttributeTypeEntity } from './entity/room.attributeType.entity';
import { RoomAttributeTypeDto } from './dto/roomAttributeTypeDto';
import ICrudService from '../../../base/crud.interface.service';

@Injectable()
export class RoomAttributeTypeService
  implements ICrudService<RoomAttributeTypeDto> {
  constructor(
    @InjectRepository(RoomAttributeTypeEntity)
    private readonly roomAttributeTypesRepository: Repository<
      RoomAttributeTypeEntity
    >,
  ) {}

  public async deleteById(teamId: string, id: number): Promise<boolean> {
    await this.roomAttributeTypesRepository.delete({
      team: { id: teamId },
      id,
    });
    return true;
  }

  public async getById(
    teamId: string,
    id: number,
  ): Promise<RoomAttributeTypeDto> {
    const attributeType = await this.roomAttributeTypesRepository.findOne({
      team: { id: teamId },
      id,
    });
    return attributeType.toDto();
  }

  public async getAll(teamId: string): Promise<RoomAttributeTypeDto[]> {
    const rooms = await this.roomAttributeTypesRepository.find({
      where: [{ teamId }, { teamId: null }],
    });
    return rooms.map(entity => entity.toDto());
  }

  public async deleteItems(teamId: string, ids: number[]): Promise<boolean> {
    await this.roomAttributeTypesRepository.delete(ids);
    return true;
  }

  public async add(
    teamId: string,
    dto: RoomAttributeTypeDto,
  ): Promise<RoomAttributeTypeDto> {
    const entity = new RoomAttributeTypeEntity();
    entity.name = dto.name;
    entity.defaultValue = dto.defaultValue;
    entity.teamId = teamId;
    const saved = await this.roomAttributeTypesRepository.save(entity);
    return saved.toDto();
  }

  public async delete(teamId: string, attributeId: number): Promise<boolean> {
    await this.roomAttributeTypesRepository.delete({
      teamId,
      id: attributeId,
    });
    return true;
  }

}
