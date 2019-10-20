// Store Models
import { Record } from 'immutable';
import { SagaIterator } from 'redux-saga';
import { call, delay, takeEvery } from 'redux-saga/effects';
import actionCreatorFactory, { Action } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';

import ApiService from '../api/apiService';
import { IUserDto } from '../api/requests/user.dto';
import appConfig from '../appconf';
import { ApiError } from '../models/apiError';
import { ILoadingData } from '../models/loadingData';
import { IReduxState } from '../reduxx/reducer';

export const moduleName = 'auth';
const prefix = `${appConfig.appName}/${moduleName}`;

export interface IAuthModel {
    token: string | null;
    userProfile: ILoadingData<IUserDto>;
}

export interface ICheckTokenPayload {
    token: string;
    delay?: number;
}

const factory = actionCreatorFactory(prefix);

export const checkTokenAndGetProfile = factory.async<ICheckTokenPayload, IUserDto, ApiError>('CHECK_TOKEN_AND_GET_PROFILE');

export const getProfile = factory.async<void, IUserDto, ApiError>('GET_PROFILE');

export const logout = factory('LOGOUT');

export const createEmpty = Record<IAuthModel>({
    userProfile: { isFetching: false, isError: false },
    token: localStorage.getItem('token'),
});

export const authReducer = reducerWithInitialState(createEmpty())
    // checkToken
    .cases([checkTokenAndGetProfile.started, getProfile.started], state => state.setIn(['isTokenValid', 'isFetching'], true))
    .cases([checkTokenAndGetProfile.failed, getProfile.failed], state =>
        state.setIn(['userProfile', 'isFetching'], false).setIn(['userProfile', 'isError'], true),
    )
    .case(checkTokenAndGetProfile.done, (state, payload) =>
        state
            .setIn(['userProfile', 'isFetching'], false)
            .setIn(['userProfile', 'data'], payload.result)
            .set('token', payload.params.token),
    )
    .case(getProfile.done, (state, payload) => state.setIn(['userProfile', 'isFetching'], false).setIn(['userProfile', 'data'], payload.result))
    .case(logout, (state, payload) => state.set('token', null).setIn(['userProfile', 'data'], undefined));

const checkTokenWorker = bindAsyncAction(checkTokenAndGetProfile, {
    skipStartedAction: true,
})(function* (params: ICheckTokenPayload): SagaIterator {
    const apiService = new ApiService();
    const response = yield call([apiService, apiService.getProfile], params.token);
    localStorage.setItem('token', params.token);
    if (params.delay) {
        yield delay(params.delay);
    }

    return response;
});

const getProfileWorker = bindAsyncAction(getProfile, {
    skipStartedAction: true,
})(function* (): SagaIterator {
    const apiService = new ApiService();
    const response = yield call([apiService, apiService.getProfile]);
    // TODO костыль на добавление небольшой задержки, чтобы показать скелетон
    yield delay(1000);
    return response;
});

export function isAuth (state: IReduxState): boolean {
    return !!state.auth.get('token');
}

export function* saga (): SagaIterator {
    yield takeEvery<Action<ICheckTokenPayload>>(checkTokenAndGetProfile.started, action => checkTokenWorker(action.payload));

    yield takeEvery<Action<void>>(getProfile.started, action => getProfileWorker(action.payload));

    yield takeEvery(logout, action => {
        localStorage.clear();
    });
}
