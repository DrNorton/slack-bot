import { Record } from "immutable";
import actionCreatorFactory, { Action } from "typescript-fsa";
import { ApiError } from "../../models/apiError";
import AppointmentDto from "../../api/requests/booking/appointment.dto";
import appConfig from "../../appconf";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { LoadingData } from "../../models/loadingData";
import { bindAsyncAction } from "typescript-fsa-redux-saga";
import { SagaIterator } from "@redux-saga/types";
import ApiService from "../../api/apiService";
import { call, delay, takeEvery } from "@redux-saga/core/effects";
import { ReduxState } from "../../reduxx/reducer";
import moment from "moment";
import RoomDto from "../../api/requests/booking/room.dto";
import { createSelector } from "reselect";
import { colors } from "@material-ui/core";

export const moduleName = "booking/appointments";
const prefix = `${appConfig.appName}/${moduleName}`;

export interface AppointmentModel {
  appointments: LoadingData<AppointmentDto[]>;
}

export interface Appointment {
  title: string;
  description: string;
  color: string;
  start: Date;
  end: Date;
  extendedProps: { id: number; room?: RoomDto; roomId: number };
}

const factory = actionCreatorFactory(prefix);

export const getAppointments = factory.async<void, AppointmentDto[], ApiError>(
  "GET_APPOINTMENTS"
);

export const createEmpty = Record<AppointmentModel>({
  appointments: { data: [], isFetching: false, isError: false }
});

export const appointmentReducer = reducerWithInitialState(createEmpty())
  //getRooms
  .case(getAppointments.started, state =>
    state.setIn(["appointments", "isFetching"], true)
  )
  .case(getAppointments.failed, state =>
    state.setIn(["appointments", "isFetching"], false)
  )
  .case(getAppointments.done, (state, payload) =>
    state.setIn(["appointments", "data"], payload.result)
  );

export const getAppointmentsRawSelector = (
  state: ReduxState
): AppointmentDto[] => {
  return state.appointments.getIn(["appointments", "data"]);
};

export const getRoomsRawSelector = (state: ReduxState): RoomDto[] => {
  return state.rooms.get("rooms").toJS();
};

export const getAppointmentsWithRoomsSelector = createSelector(
  getAppointmentsRawSelector,
  getRoomsRawSelector,
  (appointments, rooms) => {
    return appointments.map(appointment => {
      const findedRoom = rooms.find(room => room.id === appointment.roomId);
      const appointmentModel: Appointment = {
        description: appointment.desc,
        title: appointment.title,
        end: moment(appointment.end).toDate(),
        start: moment(appointment.start).toDate(),
        color: findedRoom ? findedRoom.color : colors.green["700"],
        extendedProps: {
          id: appointment.id,
          room: findedRoom,
          roomId: appointment.roomId
        }
      };
      return appointmentModel;
    });
  }
);

const getAppointmentsWorker = bindAsyncAction(getAppointments, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const apiService = new ApiService();
  const response = yield call([apiService, apiService.getAppointments]);
  //TODO костыль на добавление небольшой задержки, чтобы показать скелетон
  yield delay(1000);
  return response;
});

export function* saga(): SagaIterator {
  yield takeEvery<Action<void>>(getAppointments.started, action =>
    getAppointmentsWorker()
  );
}
