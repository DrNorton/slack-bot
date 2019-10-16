import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { BaseCrudController } from '../../base/base.crud.controller';
import { RoomAttributeTypeDto } from '../meetingRooms/attributeTypes/dto/roomAttributeTypeDto';
import { RoomAttributeTypeService } from '../meetingRooms/attributeTypes/roomAttributeType.service';

@ApiBearerAuth()
@ApiUseTags('appointment')
@Controller('appointment')
export default class AppointmentController extends BaseCrudController<
  RoomAttributeTypeDto
  > {
  constructor(private readonly attributeTypesService: RoomAttributeTypeService) {
    super(attributeTypesService);
  }
}
