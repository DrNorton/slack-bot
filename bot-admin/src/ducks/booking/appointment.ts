import { colors } from '@material-ui/core';
import { call, delay, takeEvery } from '@redux-saga/core/effects';
import { SagaIterator } from '@redux-saga/types';
import { Record } from 'immutable';
import moment from 'moment';
import { createSelector } from 'reselect';
import actionCreatorFactory, { Action } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';

import ApiService from '../../api/apiService';
import { IAppointmentDto } from '../../api/requests/booking/appointment.dto';
import { IRoomDto } from '../../api/requests/booking/room.dto';
import { IMemberDto } from '../../api/requests/member.dto';
import appConfig from '../../appconf';
import { ApiError } from '../../models/apiError';
import { ILoadingData } from '../../models/loadingData';
import { IReduxState } from '../../reduxx/reducer';

export const moduleName = 'booking/appointments';
const prefix = `${appConfig.appName}/${moduleName}`;

export interface IAppointmentModel {
    appointments: ILoadingData<IAppointmentDto[]>;
}

export interface IAppointment {
    title: string;
    description: string;
    color: string;
    start: Date;
    members: IMemberDto[];
    end: Date;
    extendedProps: { id: number; room?: IRoomDto; roomId: number };
}

const factory = actionCreatorFactory(prefix);

export const getAppointments = factory.async<void, IAppointmentDto[], ApiError>('GET_APPOINTMENTS');

export const createEmpty = Record<IAppointmentModel>({
    appointments: { data: [], isFetching: false, isError: false },
});

export const appointmentReducer = reducerWithInitialState(createEmpty())
    // getRooms
    .case(getAppointments.started, state => state.setIn(['appointments', 'isFetching'], true))
    .case(getAppointments.failed, state => state.setIn(['appointments', 'isFetching'], false))
    .case(getAppointments.done, (state, payload) => state.setIn(['appointments', 'data'], payload.result));

export const getAppointmentsRawSelector = (state: IReduxState): IAppointmentDto[] => {
    return state.appointments.getIn(['appointments', 'data']);
};

export const getRoomsRawSelector = (state: IReduxState): IRoomDto[] => {
    return state.rooms.get('rooms').toJS();
};

export const getAppointmentsWithRoomsSelector = createSelector(
    getAppointmentsRawSelector,
    getRoomsRawSelector,
    (appointments, rooms) => {
        return appointments.map(appointment => {
            const findedRoom = rooms.find(room => room.id === appointment.roomId);
            const appointmentModel: IAppointment = {
                description: appointment.desc,
                title: appointment.title,
                end: moment(appointment.end).toDate(),
                start: moment(appointment.start).toDate(),
                color: findedRoom ? findedRoom.color : colors.green['700'],
                members: appointment.members,
                extendedProps: {
                    id: appointment.id,
                    room: findedRoom,
                    roomId: appointment.roomId,
                },
            };
            return appointmentModel;
        });
    },
);

const getAppointmentsWorker = bindAsyncAction(getAppointments, {
    skipStartedAction: true,
})(function* (): SagaIterator {
    const apiService = new ApiService();
    const response = yield call([apiService, apiService.getAppointments]);
    // TODO костыль на добавление небольшой задержки, чтобы показать скелетон
    yield delay(1000);
    return response;
});

export function* saga (): SagaIterator {
    yield takeEvery<Action<void>>(getAppointments.started, action => getAppointmentsWorker());
}
