import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import {
  getRepositoryToken,
  InjectRepository,
  TypeOrmModule,
} from '@nestjs/typeorm';
import { TestDatabaseModule } from '../../../../../test/test.database.module';
import { TestUtils } from '../../../../../test/test.utils';
import { RoomAttributeTypeDto } from '../attributeTypes/dto/roomAttributeTypeDto';
import { RoomAttributeService } from '../attributes/roomAttribute.service';
import { RoomAttributeEntity } from '../attributes/entity/roomAttribute.entity';
import { RoomAttributeDto } from '../attributes/dto/roomAttribute.dto';
import RoomDto from '../rooms/dto/room.dto';
import { RoomEntity } from '../rooms/entity/room.entity';
import { RoomAttributeTypeEntity } from '../attributeTypes/entity/room.attributeType.entity';
import { RoomsService } from '../rooms/rooms.service';
import { TeamEntity } from '../../../team/entity/team.entity';
import { Repository } from 'typeorm';

describe('Attribute service', () => {
  let attributeService: RoomAttributeService;
  let roomService: RoomsService;
  let sandbox: sinon.SinonSandbox;
  let module: TestingModule;
  let testUtils: TestUtils;
  let addedAttributeId: number;
  let roomRepository: Repository<RoomEntity>;
  let roomAttributeTypeRepository: Repository<RoomAttributeTypeEntity>;

  beforeAll(async () => {
    sandbox = sinon.createSandbox();
    module = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([
          RoomAttributeEntity,
          RoomEntity,
          RoomAttributeTypeEntity,
        ]),
      ],
      providers: [RoomAttributeService, RoomsService],
    }).compile();
    testUtils = module.get<TestUtils>(TestUtils);
    await testUtils.reloadFixtures([TeamEntity]);
    attributeService = module.get<RoomAttributeService>(RoomAttributeService);
    roomService = module.get<RoomsService>(RoomsService);
    roomRepository = module.get(getRepositoryToken(RoomEntity));
    roomAttributeTypeRepository = module.get(
      getRepositoryToken(RoomAttributeTypeEntity),
    );
  });

  it('attributes is empty', async () => {
    const attributes = await attributeService.getAll('1');
    expect(attributes).toHaveLength(0);
  });

  it('add attribute without existing room', async () => {
    const roomAttribute = new RoomAttributeDto();
    roomAttribute.attributeType = new RoomAttributeTypeDto();
    roomAttribute.attributeType.id = 1;
    roomAttribute.value = 'result';
    roomAttribute.room = new RoomDto();
    roomAttribute.room.id = 15;
    let status = 0;
    let message = '';
    try {
      await attributeService.add('1', roomAttribute);
    } catch (e) {
      status = e.status;
      message = e.message;
    }
    expect(status).toBe(404);
    expect(message).toBe('Переговорка не найдена');
  });

  it('add attribute without existing attribute type', async () => {
    await testUtils.loadAll([RoomEntity]);
    const roomAttribute = new RoomAttributeDto();
    roomAttribute.value = 'TEST';
    const fakeAttributeType = new RoomAttributeTypeEntity();
    fakeAttributeType.id = 15;
    roomAttribute.attributeType = fakeAttributeType;
    roomAttribute.value = 'result';
    roomAttribute.room = await roomRepository.findOne();
    let status = 0;
    let message = '';
    try {
      await attributeService.add('1', roomAttribute);
    } catch (e) {
      status = e.status;
      message = e.message;
    }
    expect(status).toBe(404);
    expect(message).toBe('Тип атрибута не найден');
  });

  it('add attribute', async () => {
    await testUtils.loadAll([RoomAttributeTypeEntity]);
    const roomAttribute = new RoomAttributeDto();
    roomAttribute.value = 'TEST';
    roomAttribute.attributeType = (await roomAttributeTypeRepository.findOne()).toDto();
    roomAttribute.room = (await roomRepository.findOne()).toDto();
    const addedAttribute = await attributeService.add('1', roomAttribute);
    expect(addedAttribute.id).not.toBeUndefined();
    console.log(JSON.stringify(addedAttribute));
    addedAttributeId = addedAttribute.id;
    expect(addedAttributeId).not.toBeUndefined();
    console.log(`ЗАПИСЫВАЮ ${addedAttributeId}`);
  });

  it('get attribute', async () => {
    const attribute = await attributeService.getById('1', addedAttributeId);
    expect(attribute.id).toBe(addedAttributeId);
    expect(attribute.value).toBe('TEST');
  });

  it('get not existing attribute', async () => {
    const attribute = await attributeService.getById('1', 12);
    expect(attribute).toBeNull();
  });

  it('delete attribute', async () => {
    const result = await attributeService.deleteById('1', addedAttributeId);
    expect(result).toBe(true);
    const attributes = await attributeService.getAll('1');
    expect(attributes).toHaveLength(0);
  });

  afterAll(async () => {
    await module.close();
  });

  afterAll(async () => {
    await testUtils.closeDbConnection();
    sandbox.restore();
  });
});
