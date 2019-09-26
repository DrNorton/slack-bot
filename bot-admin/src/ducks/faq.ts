// Store Models
import { LoadingData } from "../models/loadingData";
import actionCreatorFactory, { Action } from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import appConfig from "../appconf";
import { SagaIterator } from "redux-saga";
import { takeEvery, call, put, delay } from "redux-saga/effects";
import { bindAsyncAction } from "typescript-fsa-redux-saga";
import ApiService from "../api/apiService";
import { FaqDto } from "../api/requests/faq.dto";
import { ApiError } from "../models/apiError";
import { Record } from "immutable";
import { goBack, push } from "connected-react-router";

export const moduleName = "faq";
const prefix = `${appConfig.appName}/${moduleName}`;

export interface FaqModel {
  faqItems: LoadingData<FaqDto[]>;
  editedFaqItem: LoadingData<FaqDto>;
}

export interface CreateOrUpdateFaqPayload {
  faqItem: FaqDto;
  isUpdate: boolean;
}

const factory = actionCreatorFactory(prefix);

export const getFaqItems = factory.async<void, FaqDto[], ApiError>(
  "GET_FAQ_ITEMS"
);

export const getFaqItemById = factory.async<number, FaqDto, ApiError>(
  "GET_FAQ_ITEM_BY_ID"
);

export const deleteFaqItem = factory.async<FaqDto, boolean, ApiError>(
  "DELETE_EVENT"
);

export const createOrUpdateFaqItem = factory.async<
  CreateOrUpdateFaqPayload,
  FaqDto,
  ApiError
>("CREATE_OR_UPDATE_EVENT");

export const createEmpty = Record<FaqModel>({
  faqItems: { isFetching: false, data: [], isError: false },
  editedFaqItem: {
    isFetching: false,
    data: { id: 0, question: "", answer: "" },
    isError: false
  }
});

export const faqReducer = reducerWithInitialState(createEmpty())
  // getEventsByStreamId
  .case(getFaqItems.started, state =>
    state.setIn(["faqItems", "isFetching"], true)
  )
  .case(getFaqItems.failed, state =>
    state
      .setIn(["faqItems", "isFetching"], false)
      .setIn(["faqItems", "isError"], true)
  )
  .case(getFaqItems.done, (state, payload) =>
    state
      .setIn(["faqItems", "isFetching"], false)
      .setIn(["faqItems", "data"], payload.result)
  )
  //deleteEvent
  .case(deleteFaqItem.started, state =>
    state.setIn(["faqItems", "isFetching"], true)
  )
  .case(deleteFaqItem.failed, state =>
    state
      .setIn(["faqItems", "isFetching"], false)
      .setIn(["faqItems", "isError"], true)
  )
  .case(deleteFaqItem.done, (state, payload) =>
    state
      .setIn(["faqItems", "isFetching"], false)
      .updateIn(["faqItems", "data"], list =>
        list.filter(x => x.id !== payload.params.id)
      )
  )

  // getEventsByStreamId
  .case(getFaqItemById.started, state =>
    state.setIn(["editedFaqItem", "isFetching"], true)
  )
  .case(getFaqItemById.failed, state =>
    state
      .setIn(["editedFaqItem", "isFetching"], false)
      .setIn(["editedFaqItem", "isError"], true)
  )
  .case(getFaqItemById.done, (state, payload) =>
    state
      .setIn(["editedFaqItem", "isFetching"], false)
      .setIn(["editedFaqItem", "data"], payload.result)
  )
  //add
  .case(createOrUpdateFaqItem.started, state =>
    state.setIn(["editedFaqItem", "isFetching"], true)
  )
  .case(createOrUpdateFaqItem.failed, state =>
    state.setIn(["editedFaqItem", "isFetching"], false)
  )
  .case(createOrUpdateFaqItem.done, (state, payload) =>
    state
      .setIn(["editedFaqItem", "isFetching"], false)
      .setIn(["editedFaqItem", "data"], payload.result)
  );

const getFaqItemsWorker = bindAsyncAction(getFaqItems, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const apiService = new ApiService();
  const response = yield call([apiService, apiService.getFaqItems]);
  //TODO костыль на добавление небольшой задержки, чтобы показать скелетон
  yield delay(1000);
  return response;
});

const getFaqItemByIdWorker = bindAsyncAction(getFaqItemById, {
  skipStartedAction: true
})(function*(eventId: number): SagaIterator {
  const apiService = new ApiService();
  const response = yield call([apiService, apiService.getFaqItemById], eventId);
  //TODO костыль на добавление небольшой задержки, чтобы показать скелетон
  yield delay(1000);
  return response;
});

const createOrUpdateFaqItemWorker = bindAsyncAction(createOrUpdateFaqItem, {
  skipStartedAction: true
})(function*(payload: CreateOrUpdateFaqPayload): SagaIterator {
  const apiService = new ApiService();
  let result;
  if (payload.isUpdate) {
    result = yield call(
      [apiService, apiService.updateFaqItem],
      payload.faqItem
    );
  } else {
    result = yield call(
      [apiService, apiService.createFaqItem],
      payload.faqItem
    );
  }
  yield put(goBack());
  return result;
});

const deleteEventWorker = bindAsyncAction(deleteFaqItem, {
  skipStartedAction: true
})(function*(payload: FaqDto): SagaIterator {

  const apiService = new ApiService();
  const response = yield call([apiService, apiService.deleteFaqItem], payload);
  return true;
});

export function* saga(): SagaIterator {
  yield takeEvery<Action<void>>(getFaqItems.started, action =>
    getFaqItemsWorker(action.payload)
  );
  yield takeEvery<Action<number>>(getFaqItemById.started, action =>
    getFaqItemByIdWorker(action.payload)
  );
  yield takeEvery<Action<CreateOrUpdateFaqPayload>>(
    createOrUpdateFaqItem.started,
    action => createOrUpdateFaqItemWorker(action.payload)
  );
  yield takeEvery<Action<FaqDto>>(deleteFaqItem.started, action =>
    deleteEventWorker(action.payload)
  );
}
