import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDatabaseModule } from '../../../../../test/test.database.module';
import { TestUtils } from '../../../../../test/test.utils';
import { RoomAttributeTypeEntity } from '../attributeTypes/entity/room.attributeType.entity';
import { RoomAttributeTypeDto } from '../attributeTypes/dto/roomAttributeTypeDto';
import { RoomAttributeTypeService } from '../attributeTypes/roomAttributeType.service';
import { TeamEntity } from '../../../team/entity/team.entity';

describe('attributeTypes service', () => {
  let attributeTypesService: RoomAttributeTypeService;
  let sandbox: sinon.SinonSandbox;
  let module: TestingModule;
  let testUtils: TestUtils;
  let addedAttributeTypeId: number;

  beforeAll(async () => {
    sandbox = sinon.createSandbox();
    module = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        TypeOrmModule.forFeature([RoomAttributeTypeEntity]),
      ],
      providers: [RoomAttributeTypeService],
    }).compile();
    testUtils = module.get<TestUtils>(TestUtils);
    await testUtils.reloadFixtures([TeamEntity]);
    attributeTypesService = module.get<RoomAttributeTypeService>(
      RoomAttributeTypeService,
    );
  });

  it('attributes types is empty', async () => {
    const types = await attributeTypesService.getAll('1');
    expect(types).toHaveLength(0);
  });

  it('add attributeType', async () => {
    const attributeType1 = new RoomAttributeTypeDto();
    attributeType1.name = 'Параметр 1';
    attributeType1.defaultValue = 'Значение 1';
    const addedType = await attributeTypesService.add('1', attributeType1);
    expect(addedType.name).toBe(attributeType1.name);
    expect(addedType.defaultValue).toBe(attributeType1.defaultValue);
    addedAttributeTypeId = addedType.id;
  });

  it('check that attributeTypes was added', async () => {
    expect(addedAttributeTypeId).not.toBeUndefined();
    expect(typeof addedAttributeTypeId).toBe('number');

    const attributeTypeDto = await attributeTypesService.getById(
      '1',
      addedAttributeTypeId,
    );
    expect(attributeTypeDto.id).toBe(addedAttributeTypeId);
  });

  it('attributes types have added item', async () => {
    const types = await attributeTypesService.getAll('1');
    expect(types).toHaveLength(1);
  });

  it('delete attribute types', async () => {
    expect(addedAttributeTypeId).not.toBeUndefined();
    expect(typeof addedAttributeTypeId).toBe('number');
    const result = await attributeTypesService.delete(
      '1',
      addedAttributeTypeId,
    );
    expect(result).toBe(true);
  });

  it('attributeTypes is empty', async () => {
    const rooms = await attributeTypesService.getAll('1');
    expect(rooms).toHaveLength(0);
  });

  afterAll(async () => {
    await module.close();
  });

  afterAll(async () => {
    await testUtils.closeDbConnection();
    sandbox.restore();
  });
});
