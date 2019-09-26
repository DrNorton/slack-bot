import appConfig from "../appconf";
import actionCreatorFactory, { Action } from "typescript-fsa";
import { ApiError } from "../models/apiError";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { takeEvery, call, put, delay } from "redux-saga/effects";
import { bindAsyncAction } from "typescript-fsa-redux-saga";
import ApiService from "../api/apiService";
import { SagaIterator } from "redux-saga";
import { List, Record, Map } from "immutable";
import { EmojiDto } from "../api/requests/emoji.dto";
import { LoadingData } from "../models/loadingData";
import TopItemDto from "../api/requests/topItemDto";
import { WinnerPeriod } from "../api/requests/winnerPeriod";
import { createSelector } from "reselect";
import { ReduxState } from "../reduxx/reducer";

export const moduleName = "score";
const prefix = `${appConfig.appName}/${moduleName}`;
// State model

export type WinnersStorage = {
  [key in WinnerPeriod]: TopItemDto[];
};

export interface AddEmojiPayload {
  newEmoji: EmojiDto;
}

export interface UpdateEmojiPayload {
  updatedEmoji: EmojiDto[];
}

export interface ScoreModel {
  isFetching: boolean;
  emoji: LoadingData<List<EmojiDto>>;
  winners: Record<WinnersStorage>;
}

const factory = actionCreatorFactory(prefix);

export const getEmoji = factory.async<void, EmojiDto[], ApiError>("GET_EMOJI");

export const addEmoji = factory<AddEmojiPayload>("ADD_EMOJI");

export const updateEmoji = factory.async<
  UpdateEmojiPayload,
  EmojiDto[],
  ApiError
>("UPDATE_EMOJI");

export const deleteEmoji = factory.async<EmojiDto, boolean, ApiError>(
  "DELETE_EMOJI"
);

export const getWinnersByPeriod = factory.async<
  WinnerPeriod,
  TopItemDto[],
  ApiError
>("GET_WINNERS_BY_PERIOD");

const createEmpty = Record<ScoreModel>({
  isFetching: false,
  emoji: { data: List<EmojiDto>([]), isFetching: false, isError: false },
  winners: Record<WinnersStorage>({ week: [], month: [], year: [] })()
});

export const scoreReducer = reducerWithInitialState(createEmpty())
  .case(getEmoji.started, state => state.setIn(["emoji", "isFetching"], true))
  .case(getEmoji.failed, state =>
    state
      .setIn(["emoji", "isFetching"], false)
      .setIn(["emoji", "isError"], true)
  )

  .case(getEmoji.done, (state, payload) =>
    state
      .setIn(["emoji", "isFetching"], false)
      .setIn(["emoji", "data"], List(payload.result))
  )
  .case(getWinnersByPeriod.done, (state, payload) =>
    state
      .set("isFetching", false)
      .setIn(["winners", payload.params], payload.result)
  )
  .case(getWinnersByPeriod.started, state => state.set("isFetching", true))
  .case(getWinnersByPeriod.failed, state =>
    state.set("isFetching", false).setIn(["weekWinners", "isError"], true)
  )
  //delete emoji
  .case(deleteEmoji.done, (state, payload) =>
    state
      .setIn(["emoji", "isFetching"], false)
      .updateIn(["emoji", "data"], list =>
        list.filter(x => x.name !== payload.params.name)
      )
  )
  .case(deleteEmoji.started, state =>
    state.setIn(["emoji", "isFetching"], true)
  )
  .case(deleteEmoji.failed, state =>
    state
      .setIn(["emoji", "isFetching"], false)
      .setIn(["weekWinners", "isError"], true)
  )
  //update emoji
  .case(updateEmoji.done, (state, payload) =>
    state
      .setIn(["emoji", "isFetching"], false)
      .setIn(["emoji", "data"], List(payload.result))
  )
  .case(updateEmoji.started, state =>
    state.setIn(["emoji", "isFetching"], true)
  )
  .case(updateEmoji.failed, state =>
    state
      .setIn(["emoji", "isFetching"], false)
      .setIn(["emoji", "isError"], true)
  )
  //addEmoji
  .case(addEmoji, (state, payload) =>
    state
      .setIn(["emoji", "isFetching"], false)
      .updateIn(["emoji", "data"], list => list.push(payload.newEmoji))
  );

const getEmojiWorker = bindAsyncAction(getEmoji, {
  skipStartedAction: true
})(function*() {
  const apiService = new ApiService();
  const response = yield call([apiService, apiService.getEmojies]);
  //TODO костыль на добавление небольшой задержки, чтобы показать скелетон
  yield delay(1000);
  return response;
});

const getWeekWinnersWorker = bindAsyncAction(getWinnersByPeriod, {
  skipStartedAction: true
})(function*(payload: WinnerPeriod) {
  const apiService = new ApiService();
  const response = yield call(
    [apiService, apiService.getPeriodWinners],
    payload
  );
  return response;
});

const deleteEmojiWorker = bindAsyncAction(deleteEmoji, {
  skipStartedAction: true
})(function*(payload: EmojiDto) {
  const apiService = new ApiService();
  const response = yield call([apiService, apiService.deleteEmoji], payload);
  return response;
});

const updateEmojiWorker = bindAsyncAction(updateEmoji, {
  skipStartedAction: true
})(function*(payload: UpdateEmojiPayload) {
  const apiService = new ApiService();
  const response = yield call(
    [apiService, apiService.updateEmoji],
    payload.updatedEmoji
  );
  //TODO костыль на добавление небольшой задержки, чтобы показать скелетон
  yield delay(1000);
  return response;
});

//selectors

// reselect function
export const getEmojiSelector = createSelector(
  [
    (state: ReduxState) => {
      return state.score.getIn(["emoji", "data"]).toArray();
    }
  ],
  bar => bar
);

export function* saga(): SagaIterator {
  yield takeEvery<Action<void>>(getEmoji.started, action => getEmojiWorker());
  yield takeEvery<Action<WinnerPeriod>>(getWinnersByPeriod.started, action =>
    getWeekWinnersWorker(action.payload)
  );
  yield takeEvery<Action<EmojiDto>>(deleteEmoji.started, action =>
    deleteEmojiWorker(action.payload)
  );
  yield takeEvery<Action<UpdateEmojiPayload>>(updateEmoji.started, action =>
    updateEmojiWorker(action.payload)
  );
}
