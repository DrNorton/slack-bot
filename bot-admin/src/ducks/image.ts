import { List, Record } from 'immutable';
import { SagaIterator } from 'redux-saga';
import { call, takeEvery } from 'redux-saga/effects';
import actionCreatorFactory, { Action } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import ApiService from '../api/apiService';
import { IImageDto } from '../api/requests/image.dto';
import appConfig from '../appconf';
import { ApiError } from '../models/apiError';

export const moduleName = 'image';
const prefix = `${appConfig.appName}/${moduleName}`;

// State model
export interface IImageModel {
    images: List<IImageDto>;
    isFetching: boolean;
}

// Action Creators

const factory = actionCreatorFactory(prefix);

export const getImages = factory.async<void, IImageDto[], ApiError>('GET_IMAGES');

export const uploadImage = factory.async<File, IImageDto, ApiError>('UPLOAD_IMAGE');

export const deleteImage = factory.async<IImageDto, boolean, ApiError>('DELETE_IMAGE');

const createEmpty = Record<IImageModel>({
    images: List<IImageDto>([]),
    isFetching: false,
});

export const imageReducer = reducerWithInitialState(createEmpty())
    .case(getImages.started, state => state.set('isFetching', true))
    .case(getImages.failed, state => state.set('isFetching', false))
    .case(getImages.done, (state, payload) => state.set('images', List(payload.result)).set('isFetching', false))

    .case(uploadImage.started, state => state.set('isFetching', true))
    .case(uploadImage.failed, state => state.set('isFetching', false))
    .case(uploadImage.done, (state, payload) => state.update('images', images => images.push(payload.result)).set('isFetching', false))
    .case(deleteImage.started, state => state.set('isFetching', true))
    .case(deleteImage.failed, state => state.set('isFetching', false))
    .case(deleteImage.done, (state, payload) =>
        state.update('images', images => images.filter(x => x.id !== payload.params.id)).set('isFetching', false),
    );

const getImagesWorker = bindAsyncAction(getImages, {
    skipStartedAction: true,
})(function*() {
    const apiService = new ApiService();
    return yield call([apiService, apiService.getImages]);
});

const uploadImageWorker = bindAsyncAction(uploadImage, {
    skipStartedAction: true,
})(function*(image: File) {
    const apiService = new ApiService();
    return yield call([apiService, apiService.uploadFile], image);
});

const deleteImageWorker = bindAsyncAction(deleteImage, {
    skipStartedAction: true,
})(function*(image: IImageDto) {
    const apiService = new ApiService();
    return yield call([apiService, apiService.deleteImage], image);
});

export function* saga(): SagaIterator {
    yield takeEvery<Action<void>>(getImages.started, action => getImagesWorker());
    yield takeEvery<Action<File>>(uploadImage.started, action => uploadImageWorker(action.payload));
    yield takeEvery<Action<IImageDto>>(deleteImage.started, action => deleteImageWorker(action.payload));
}
