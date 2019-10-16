// Store Models
import actionCreatorFactory, { Action } from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { SagaIterator } from "redux-saga";
import { takeEvery, call, delay, put } from "redux-saga/effects";
import { bindAsyncAction } from "typescript-fsa-redux-saga";
import appConfig from "../../appconf";
import RoomDto from "../../api/requests/booking/room.dto";
import { Record, List } from "immutable";
import { ApiError } from "../../models/apiError";
import ApiService from "../../api/apiService";
import RoomAttributeDto, {
  RoomAttributeTypeDto
} from "../../api/requests/booking/roomAttribute.dto";
import { createSelector } from "reselect";
import { ReduxState } from "../../reduxx/reducer";
export const moduleName = "booking/rooms";
const prefix = `${appConfig.appName}/${moduleName}`;

export interface RoomsModel {
  rooms: List<RoomDto>;
  availableAttributeTypes: List<RoomAttributeTypeDto>;
  roomsFetching: boolean;
  attributeTypesFetching: boolean;
  isError: boolean;
}

const factory = actionCreatorFactory(prefix);

export const getRooms = factory.async<void, RoomDto[], ApiError>("GET_ROOMS");
export const addRoom = factory.async<RoomDto, RoomDto, ApiError>("ADD_ROOM");
export const addAttributeType = factory.async<
  RoomAttributeTypeDto,
  RoomAttributeTypeDto,
  ApiError
>("ADD_ATTRIBUTE_TYPE");
export const deleteAttributeTypes = factory.async<number[], boolean, ApiError>(
  "DELETE_ATTRIBUTE_TYPES"
);
export const deleteRooms = factory.async<number[], boolean, ApiError>(
  "DELETE_ROOM"
);
export const getAttributeTypes = factory.async<
  void,
  RoomAttributeTypeDto[],
  ApiError
>("GET_ATTRIBUTE_TYPES");

export const createEmpty = Record<RoomsModel>({
  rooms: List([]),
  availableAttributeTypes: List([]),
  roomsFetching: false,
  attributeTypesFetching: false,
  isError: false
});

export const roomsReducer = reducerWithInitialState(createEmpty())
  //getRooms
  .cases([getRooms.started, addRoom.started], state =>
    state.set("roomsFetching", true)
  )
  .cases(
    [
      getAttributeTypes.started,
      addAttributeType.started,
      deleteAttributeTypes.started
    ],
    state => state.set("attributeTypesFetching", true)
  )
  .cases(
    [
      getAttributeTypes.failed,
      addAttributeType.failed,
      deleteAttributeTypes.failed
    ],
    state => state.set("attributeTypesFetching", false)
  )
  .cases([getRooms.failed, getAttributeTypes.failed, addRoom.failed], state =>
    state.set("roomsFetching", false).set("isError", true)
  )
  .case(getRooms.done, (state, payload) =>
    state.set("roomsFetching", false).set("rooms", List(payload.result))
  )
  .case(getAttributeTypes.done, (state, payload) =>
    state
      .set("attributeTypesFetching", false)
      .set("availableAttributeTypes", List(payload.result))
  )
  .case(addAttributeType.done, (state, payload) =>
    state
      .set("attributeTypesFetching", false)
      .update("availableAttributeTypes", list => list.push(payload.result))
  )
  .case(deleteAttributeTypes.done, (state, payload) =>
    state
      .set("attributeTypesFetching", false)
      .update("availableAttributeTypes", list =>
        list.filter(item => payload.params.indexOf(item.id) === -1)
      )
  );
//delete attributeType

//selectors

export const getAttributeTypesList = (
  state: ReduxState
): RoomAttributeTypeDto[] => {
  return state.rooms.get("availableAttributeTypes").toArray();
};
export const getRoomsList = (state: ReduxState): RoomDto[] =>
  state.rooms.get("rooms").toArray();

export const getRoomsWithAttributesSelector = createSelector(
  getAttributeTypesList,
  getRoomsList,
  (types, rooms) => {
    return rooms.map(room => {
      let attributes: RoomAttributeDto[] = [];
      attributes = types.map(type => {
        const findedAttribute = room.attributes.find(
          x => x.attributeType.id === type.id
        );
        if (findedAttribute) {
          return findedAttribute;
        } else {
          return { attributeType: type, value: "" };
        }
      });
      room.attributes = attributes;
      return room;
    });
  }
);

export const getAttributeTypesSelector = createSelector(
  [getAttributeTypesList],
  bar => bar
);

export const getEditedItem = (
  state: ReduxState,
  id: number
): RoomDto | undefined => {
  return state.rooms.get("rooms").find(x => x.id === id);
};

const getRoomsWorker = bindAsyncAction(getRooms, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const apiService = new ApiService();
  const response = yield call([apiService, apiService.getRooms]);
  //TODO костыль на добавление небольшой задержки, чтобы показать скелетон
  yield delay(2000);
  return response;
});

const getAvailableAttributeTypesWorker = bindAsyncAction(getAttributeTypes, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const apiService = new ApiService();
  const response = yield call([apiService, apiService.getAttributeTypes]);
  //TODO костыль на добавление небольшой задержки, чтобы показать скелетон
  yield delay(1000);
  return response;
});

const addRoomWorker = bindAsyncAction(addRoom, {
  skipStartedAction: true
})(function*(dto: RoomDto): SagaIterator {
  const apiService = new ApiService();
  const response = yield call([apiService, apiService.addRoom], dto);
  //TODO костыль на добавление небольшой задержки, чтобы показать скелетон
  yield delay(1000);
  return response;
});

const deleteRoomsWorker = bindAsyncAction(deleteRooms, {
  skipStartedAction: true
})(function*(ids: number[]): SagaIterator {
  const apiService = new ApiService();
  const response = yield call([apiService, apiService.deleteRooms], ids);
  //TODO костыль на добавление небольшой задержки, чтобы показать скелетон
  yield delay(1000);
  yield put(getRooms.started());
  return response;
});

const deleteAttributeTypesWorker = bindAsyncAction(deleteAttributeTypes, {
  skipStartedAction: true
})(function*(ids: number[]): SagaIterator {
  const apiService = new ApiService();
  const response = yield call(
    [apiService, apiService.deleteAttributeTypes],
    ids
  );
  //TODO костыль на добавление небольшой задержки, чтобы показать скелетон
  yield delay(1000);
  yield put(getRooms.started());
  return response;
});

const addAttributeTypeWorker = bindAsyncAction(addAttributeType, {
  skipStartedAction: true
})(function*(payload: RoomAttributeTypeDto): SagaIterator {
  const apiService = new ApiService();
  const response = yield call(
    [apiService, apiService.addAttributeType],
    payload
  );
  //TODO костыль на добавление небольшой задержки, чтобы показать скелетон
  yield delay(1000);
  return response;
});

export function* saga(): SagaIterator {
  yield takeEvery<Action<void>>(getRooms.started, action => getRoomsWorker());
  yield takeEvery<Action<void>>(getAttributeTypes.started, action =>
    getAvailableAttributeTypesWorker()
  );
  yield takeEvery<Action<RoomDto>>(addRoom.started, action =>
    addRoomWorker(action.payload)
  );
  yield takeEvery<Action<number[]>>(deleteRooms.started, action =>
    deleteRoomsWorker(action.payload)
  );
  yield takeEvery<Action<RoomAttributeTypeDto>>(
    addAttributeType.started,
    action => addAttributeTypeWorker(action.payload)
  );
  yield takeEvery<Action<number[]>>(deleteAttributeTypes.started, action =>
    deleteAttributeTypesWorker(action.payload)
  );
}
