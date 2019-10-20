// Store Models
import { goBack } from 'connected-react-router';
import { Record } from 'immutable';
import { SagaIterator } from 'redux-saga';
import { call, delay, put, takeEvery } from 'redux-saga/effects';
import actionCreatorFactory, { Action } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';

import ApiService from '../api/apiService';
import { IFaqDto } from '../api/requests/faq.dto';
import appConfig from '../appconf';
import { ApiError } from '../models/apiError';
import { ILoadingData } from '../models/loadingData';

export const moduleName = 'faq';
const prefix = `${appConfig.appName}/${moduleName}`;

export interface IFaqModel {
    faqItems: ILoadingData<IFaqDto[]>;
    editedFaqItem: ILoadingData<IFaqDto>;
}

export interface ICreateOrUpdateFaqPayload {
    faqItem: IFaqDto;
    isUpdate: boolean;
}

const factory = actionCreatorFactory(prefix);

export const getFaqItems = factory.async<void, IFaqDto[], ApiError>('GET_FAQ_ITEMS');

export const getFaqItemById = factory.async<number, IFaqDto, ApiError>('GET_FAQ_ITEM_BY_ID');

export const deleteFaqItem = factory.async<IFaqDto, boolean, ApiError>('DELETE_EVENT');

export const createOrUpdateFaqItem = factory.async<ICreateOrUpdateFaqPayload, IFaqDto, ApiError>('CREATE_OR_UPDATE_EVENT');

export const createEmpty = Record<IFaqModel>({
    faqItems: { isFetching: false, data: [], isError: false },
    editedFaqItem: {
        isFetching: false,
        data: { id: 0, question: '', answer: '' },
        isError: false,
    },
});

export const faqReducer = reducerWithInitialState(createEmpty())
    // getEventsByStreamId
    .case(getFaqItems.started, state => state.setIn(['faqItems', 'isFetching'], true))
    .case(getFaqItems.failed, state => state.setIn(['faqItems', 'isFetching'], false).setIn(['faqItems', 'isError'], true))
    .case(getFaqItems.done, (state, payload) => state.setIn(['faqItems', 'isFetching'], false).setIn(['faqItems', 'data'], payload.result))
    // deleteEvent
    .case(deleteFaqItem.started, state => state.setIn(['faqItems', 'isFetching'], true))
    .case(deleteFaqItem.failed, state => state.setIn(['faqItems', 'isFetching'], false).setIn(['faqItems', 'isError'], true))
    .case(deleteFaqItem.done, (state, payload) =>
        state.setIn(['faqItems', 'isFetching'], false).updateIn(['faqItems', 'data'], list => list.filter(x => x.id !== payload.params.id)),
    )

    // getEventsByStreamId
    .case(getFaqItemById.started, state => state.setIn(['editedFaqItem', 'isFetching'], true))
    .case(getFaqItemById.failed, state => state.setIn(['editedFaqItem', 'isFetching'], false).setIn(['editedFaqItem', 'isError'], true))
    .case(getFaqItemById.done, (state, payload) =>
        state.setIn(['editedFaqItem', 'isFetching'], false).setIn(['editedFaqItem', 'data'], payload.result),
    )
    // add
    .case(createOrUpdateFaqItem.started, state => state.setIn(['editedFaqItem', 'isFetching'], true))
    .case(createOrUpdateFaqItem.failed, state => state.setIn(['editedFaqItem', 'isFetching'], false))
    .case(createOrUpdateFaqItem.done, (state, payload) =>
        state.setIn(['editedFaqItem', 'isFetching'], false).setIn(['editedFaqItem', 'data'], payload.result),
    );

const getFaqItemsWorker = bindAsyncAction(getFaqItems, {
    skipStartedAction: true,
})(function* (): SagaIterator {
    const apiService = new ApiService();
    const response = yield call([apiService, apiService.getFaqItems]);
    // TODO костыль на добавление небольшой задержки, чтобы показать скелетон
    yield delay(1000);
    return response;
});

const getFaqItemByIdWorker = bindAsyncAction(getFaqItemById, {
    skipStartedAction: true,
})(function* (eventId: number): SagaIterator {
    const apiService = new ApiService();
    const response = yield call([apiService, apiService.getFaqItemById], eventId);
    // TODO костыль на добавление небольшой задержки, чтобы показать скелетон
    yield delay(1000);
    return response;
});

const createOrUpdateFaqItemWorker = bindAsyncAction(createOrUpdateFaqItem, {
    skipStartedAction: true,
})(function* (payload: ICreateOrUpdateFaqPayload): SagaIterator {
    const apiService = new ApiService();
    let result;
    if (payload.isUpdate) {
        result = yield call([apiService, apiService.updateFaqItem], payload.faqItem);
    } else {
        result = yield call([apiService, apiService.createFaqItem], payload.faqItem);
    }
    yield put(goBack());
    return result;
});

const deleteEventWorker = bindAsyncAction(deleteFaqItem, {
    skipStartedAction: true,
})(function* (payload: IFaqDto): SagaIterator {
    const apiService = new ApiService();
    return yield call([apiService, apiService.deleteFaqItem], payload);
});

export function* saga (): SagaIterator {
    yield takeEvery<Action<void>>(getFaqItems.started, action => getFaqItemsWorker(action.payload));
    yield takeEvery<Action<number>>(getFaqItemById.started, action => getFaqItemByIdWorker(action.payload));
    yield takeEvery<Action<ICreateOrUpdateFaqPayload>>(createOrUpdateFaqItem.started, action => createOrUpdateFaqItemWorker(action.payload));
    yield takeEvery<Action<IFaqDto>>(deleteFaqItem.started, action => deleteEventWorker(action.payload));
}
