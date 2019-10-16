import { Test, TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomsService } from '../rooms/rooms.service';
import { RoomEntity } from '../rooms/entity/room.entity';
import { TestDatabaseModule } from '../../../../../test/test.database.module';
import { TestUtils } from '../../../../../test/test.utils';
import RoomDto from '../rooms/dto/room.dto';
import { TeamEntity } from '../../../team/entity/team.entity';

describe('RoomsService', () => {
  let roomsService: RoomsService;
  let sandbox: sinon.SinonSandbox;
  let module: TestingModule;
  let roomsRepository: Repository<RoomEntity>;
  let testUtils: TestUtils;
  let addedRoomId: number;

  beforeAll(async () => {
    sandbox = sinon.createSandbox();
    module = await Test.createTestingModule({
      imports: [TestDatabaseModule, TypeOrmModule.forFeature([RoomEntity])],
      providers: [RoomsService],
    }).compile();
    testUtils = module.get<TestUtils>(TestUtils);
    await testUtils.reloadFixtures([TeamEntity]);
    roomsService = module.get<RoomsService>(RoomsService);
    roomsRepository = module.get<Repository<RoomEntity>>(
      getRepositoryToken(RoomEntity),
    );
  });

  it('add room', async () => {
    const newRoomEntity = new RoomDto();
    newRoomEntity.image = 'url';
    newRoomEntity.name = 'room_name';
    const newRoom = await roomsService.add('1', newRoomEntity);
    expect(newRoom.id).not.toBeUndefined();
    addedRoomId = newRoom.id;
  });

  it('check that room was added', async () => {
    expect(addedRoomId).not.toBeUndefined();
    expect(typeof addedRoomId).toBe('number');

    const room = await roomsService.getById('1', addedRoomId);
    expect(room.id).toBe(addedRoomId);
  });

  it('delete addedRoom', async () => {
    expect(addedRoomId).not.toBeUndefined();
    expect(typeof addedRoomId).toBe('number');
    const room = await roomsService.deleteById('1', addedRoomId);
    expect(room).toBe(true);
  });

  it('rooms is empty', async () => {
    const rooms = await roomsService.getAll('1');
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
