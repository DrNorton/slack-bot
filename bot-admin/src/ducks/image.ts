import actionCreatorFactory, { Action } from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import appConfig from "../appconf";
import { List, Record } from "immutable";
import { SagaIterator } from "redux-saga";
import { takeEvery, call } from "redux-saga/effects";
import { bindAsyncAction } from "typescript-fsa-redux-saga";
import ApiService from "../api/apiService";
import { ApiError } from "../models/apiError";
import ImageDto from "../api/requests/image.dto";

export const moduleName = "image";
const prefix = `${appConfig.appName}/${moduleName}`;
// State model
export interface ImageModel {
  images: List<ImageDto>;
  isFetching: boolean;
}

// Action Creators

const factory = actionCreatorFactory(prefix);

export const getImages = factory.async<void, ImageDto[], ApiError>(
  "GET_IMAGES"
);

export const uploadImage = factory.async<File, ImageDto, ApiError>(
  "UPLOAD_IMAGE"
);

export const deleteImage = factory.async<ImageDto, boolean, ApiError>(
  "DELETE_IMAGE"
);

const createEmpty = Record<ImageModel>({
  images: List<ImageDto>([]),
  isFetching: false
});

export const imageReducer = reducerWithInitialState(createEmpty())
  .case(getImages.started, state => state.set("isFetching", true))
  .case(getImages.failed, state => state.set("isFetching", false))
  .case(getImages.done, (state, payload) =>
    state.set("images", List(payload.result)).set("isFetching", false)
  )

  .case(uploadImage.started, state => state.set("isFetching", true))
  .case(uploadImage.failed, state => state.set("isFetching", false))
  .case(uploadImage.done, (state, payload) =>
    state
      .update("images", images => images.push(payload.result))
      .set("isFetching", false)
  )
  .case(deleteImage.started, state => state.set("isFetching", true))
  .case(deleteImage.failed, state => state.set("isFetching", false))
  .case(deleteImage.done, (state, payload) =>
    state
      .update("images", images =>
        images.filter(x => x.id !== payload.params.id)
      )
      .set("isFetching", false)
  );

const getImagesWorker = bindAsyncAction(getImages, {
  skipStartedAction: true
})(function*() {
  const apiService = new ApiService();
  const response = yield call([apiService, apiService.getImages]);
  return response;
});

const uploadImageWorker = bindAsyncAction(uploadImage, {
  skipStartedAction: true
})(function*(image: File) {
  const apiService = new ApiService();
  const response = yield call([apiService, apiService.uploadFile], image);
  return response;
});

const deleteImageWorker = bindAsyncAction(deleteImage, {
  skipStartedAction: true
})(function*(image: ImageDto) {
  const apiService = new ApiService();
  const response = yield call([apiService, apiService.deleteImage], image);
  return response;
});

export function* saga(): SagaIterator {
  yield takeEvery<Action<void>>(getImages.started, action => getImagesWorker());
  yield takeEvery<Action<File>>(uploadImage.started, action =>
    uploadImageWorker(action.payload)
  );
  yield takeEvery<Action<ImageDto>>(deleteImage.started, action =>
    deleteImageWorker(action.payload)
  );
}
