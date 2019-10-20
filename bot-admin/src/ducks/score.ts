import { List, Record } from 'immutable';
import { SagaIterator } from 'redux-saga';
import { call, delay, takeEvery } from 'redux-saga/effects';
import { createSelector } from 'reselect';
import actionCreatorFactory, { Action } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';

import ApiService from '../api/apiService';
import { IEmojiDto } from '../api/requests/emoji.dto';
import { ITopItemDto } from '../api/requests/topItemDto';
import { EWinnerPeriod } from '../api/requests/winnerPeriod';
import appConfig from '../appconf';
import { ApiError } from '../models/apiError';
import { ILoadingData } from '../models/loadingData';
import { IReduxState } from '../reduxx/reducer';

export const moduleName = 'score';
const prefix = `${appConfig.appName}/${moduleName}`;
// State model

export type WinnersStorage = { [key in EWinnerPeriod]: ITopItemDto[] };

export interface IAddEmojiPayload {
    newEmoji: IEmojiDto;
}

export interface IUpdateEmojiPayload {
    updatedEmoji: IEmojiDto[];
}

export interface IScoreModel {
    isFetching: boolean;
    emoji: ILoadingData<List<IEmojiDto>>;
    winners: Record<WinnersStorage>;
}

const factory = actionCreatorFactory(prefix);

export const getEmoji = factory.async<void, IEmojiDto[], ApiError>('GET_EMOJI');

export const addEmoji = factory<IAddEmojiPayload>('ADD_EMOJI');

export const updateEmoji = factory.async<IUpdateEmojiPayload, IEmojiDto[], ApiError>('UPDATE_EMOJI');

export const deleteEmoji = factory.async<IEmojiDto, boolean, ApiError>('DELETE_EMOJI');

export const getWinnersByPeriod = factory.async<EWinnerPeriod, ITopItemDto[], ApiError>('GET_WINNERS_BY_PERIOD');

const createEmpty = Record<IScoreModel>({
    isFetching: false,
    emoji: { data: List<IEmojiDto>([]), isFetching: false, isError: false },
    winners: Record<WinnersStorage>({ week: [], month: [], year: [] })(),
});

export const scoreReducer = reducerWithInitialState(createEmpty())
    .case(getEmoji.started, state => state.setIn(['emoji', 'isFetching'], true))
    .case(getEmoji.failed, state => state.setIn(['emoji', 'isFetching'], false).setIn(['emoji', 'isError'], true))

    .case(getEmoji.done, (state, payload) => state.setIn(['emoji', 'isFetching'], false).setIn(['emoji', 'data'], List(payload.result)))
    .case(getWinnersByPeriod.done, (state, payload) => state.set('isFetching', false).setIn(['winners', payload.params], payload.result))
    .case(getWinnersByPeriod.started, state => state.set('isFetching', true))
    .case(getWinnersByPeriod.failed, state => state.set('isFetching', false).setIn(['weekWinners', 'isError'], true))
    // delete emoji
    .case(deleteEmoji.done, (state, payload) =>
        state.setIn(['emoji', 'isFetching'], false).updateIn(['emoji', 'data'], list => list.filter(x => x.name !== payload.params.name)),
    )
    .case(deleteEmoji.started, state => state.setIn(['emoji', 'isFetching'], true))
    .case(deleteEmoji.failed, state => state.setIn(['emoji', 'isFetching'], false).setIn(['weekWinners', 'isError'], true))
    // update emoji
    .case(updateEmoji.done, (state, payload) => state.setIn(['emoji', 'isFetching'], false).setIn(['emoji', 'data'], List(payload.result)))
    .case(updateEmoji.started, state => state.setIn(['emoji', 'isFetching'], true))
    .case(updateEmoji.failed, state => state.setIn(['emoji', 'isFetching'], false).setIn(['emoji', 'isError'], true))
    // addEmoji
    .case(addEmoji, (state, payload) => state.setIn(['emoji', 'isFetching'], false).updateIn(['emoji', 'data'], list => list.push(payload.newEmoji)));

const getEmojiWorker = bindAsyncAction(getEmoji, {
    skipStartedAction: true,
})(function* (): any {
    const apiService = new ApiService();
    const response = yield call([apiService, apiService.getEmojies]);
    // TODO костыль на добавление небольшой задержки, чтобы показать скелетон
    yield delay(1000);
    return response;
});

const getWeekWinnersWorker = bindAsyncAction(getWinnersByPeriod, {
    skipStartedAction: true,
})(function* (payload: EWinnerPeriod): any {
    const apiService = new ApiService();
    const response = yield call([apiService, apiService.getPeriodWinners], payload);
    return response;
});

const deleteEmojiWorker = bindAsyncAction(deleteEmoji, {
    skipStartedAction: true,
})(function* (payload: IEmojiDto): any {
    const apiService = new ApiService();
    return yield call([apiService, apiService.deleteEmoji], payload);
});

const updateEmojiWorker = bindAsyncAction(updateEmoji, {
    skipStartedAction: true,
})(function* (payload: IUpdateEmojiPayload): any {
    const apiService = new ApiService();
    const response = yield call([apiService, apiService.updateEmoji], payload.updatedEmoji);
    // TODO костыль на добавление небольшой задержки, чтобы показать скелетон
    yield delay(1000);
    return response;
});

// selectors

// reselect function
export const getEmojiSelector = createSelector(
    [
        (state: IReduxState) => {
            return state.score.getIn(['emoji', 'data']).toArray();
        },
    ],
    bar => bar,
);

export function* saga (): SagaIterator {
    yield takeEvery<Action<void>>(getEmoji.started, action => getEmojiWorker());
    yield takeEvery<Action<EWinnerPeriod>>(getWinnersByPeriod.started, action => getWeekWinnersWorker(action.payload));
    yield takeEvery<Action<IEmojiDto>>(deleteEmoji.started, action => deleteEmojiWorker(action.payload));
    yield takeEvery<Action<IUpdateEmojiPayload>>(updateEmoji.started, action => updateEmojiWorker(action.payload));
}
