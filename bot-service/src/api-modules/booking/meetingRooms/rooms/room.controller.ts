import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import RoomDto from './dto/room.dto';
import { BaseCrudController } from '../../../base/base.crud.controller';

@ApiBearerAuth()
@ApiUseTags('room')
@Controller('room')
export default class RoomController extends BaseCrudController<RoomDto> {
  constructor(private readonly roomService: RoomsService) {
    super(roomService);
  }
}
