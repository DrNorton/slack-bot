import { Module } from '@nestjs/common';
import { RoomsService } from './rooms/rooms.service';
import RoomController from './rooms/room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './rooms/entity/room.entity';
import { RoomAttributeTypeEntity } from './attributeTypes/entity/room.attributeType.entity';
import { RoomAttributeEntity } from './attributes/entity/roomAttribute.entity';
import { RoomAttributeService } from './attributes/roomAttribute.service';
import { RoomAttributeTypeService } from './attributeTypes/roomAttributeType.service';
import RoomAttributeTypesController from './attributeTypes/roomAttributeTypes.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomEntity,
      RoomAttributeTypeEntity,
      RoomAttributeEntity,
    ]),
  ],
  providers: [RoomsService, RoomAttributeTypeService, RoomAttributeService],
  controllers: [RoomController, RoomAttributeTypesController],
})
export class MeetingRoomsModule {}
