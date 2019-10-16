import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { BaseCrudController } from '../../../base/base.crud.controller';
import { RoomAttributeTypeDto } from './dto/roomAttributeTypeDto';
import { RoomAttributeTypeService } from './roomAttributeType.service';

@ApiBearerAuth()
@ApiUseTags('attributetypes')
@Controller('attributetypes')
export default class RoomAttributeTypesController extends BaseCrudController<
  RoomAttributeTypeDto
> {
  constructor(private readonly attributeTypesService: RoomAttributeTypeService) {
    super(attributeTypesService);
  }
}
