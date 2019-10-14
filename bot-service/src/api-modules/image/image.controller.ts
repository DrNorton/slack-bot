import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { extname } from 'path';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BaseController } from '../base/base.controller';
import { ImageDto } from './dto/image.dto';
import { Request } from 'express';

@ApiUseTags('image')
@Controller('image')
export class ImageController extends BaseController {
  constructor(private readonly imageService: ImageService) {
    super();
  }

  @ApiOperation({ title: 'Получить картинку' })
  @Get('/:imgId')
  getImage(@Param('imgId') imgId, @Res() res) {
    return res.sendFile(imgId, { root: 'public' });
  }

  @ApiOperation({ title: 'Получить все картинки' })
  @Get()
  async getImages() {
    return this.successResponse(await this.imageService.getImages());
  }

  @ApiOperation({ title: 'Удалить картинку' })
  @Delete('/:imageId')
  async deleteImage(@Param('imageId') imageId: number) {
    return this.successResponse(await this.imageService.deleteImage(imageId));
  }

  @ApiOperation({ title: 'Загрузить картинку' })
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFile() file) {
    const newFile = new ImageDto();
    newFile.url = file.filename;
    newFile.name = file.originalname;
    await this.timeout(3000);
    return this.successResponse(await this.imageService.addImage(newFile));
  }
}
