import {
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
@ApiUseTags('image')
@Controller('image')
export class ImageController {
  @ApiOperation({ title: 'Получить картинку' })
  @Get('/:imgId')
  getImage(@Param('imgId') imgId, @Res() res) {
    return res.sendFile(imgId, { root: 'public' });
  }
}
