import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageEntity } from './entity/image.entity';
import { ImageDto } from './dto/image.dto';

export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
  ) {}

  public async getImages(): Promise<ImageDto[]> {
    const images = await this.imageRepository.find();
    return images.map(entity => this.convertImageEntityToDto(entity));
  }

  public async addImage(dto: ImageDto) {
    const imageEntity = new ImageEntity();
    imageEntity.name = dto.name;
    imageEntity.url = dto.url;
    const result = await this.imageRepository.save(imageEntity);
    return this.convertImageEntityToDto(result);
  }

  public async deleteImage(imageId: number) {
    await this.imageRepository.delete({ id: imageId });
    return true;
  }

  private convertImageEntityToDto(entity: ImageEntity) {
    const dto = new ImageDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.url = `${process.env.IMAGE_HOST}/api/image/${entity.url}`;
    return dto;
  }
}
