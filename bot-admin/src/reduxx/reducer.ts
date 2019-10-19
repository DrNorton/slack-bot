import { connectRouter } from 'connected-react-router';
import { Record } from 'immutable';
import { combineReducers } from 'redux';

import { authReducer, IAuthModel } from '../ducks/auth';
import { IRoomsModel, roomsReducer } from '../ducks/booking/rooms';
import { faqReducer, IFaqModel } from '../ducks/faq';
import { IImageModel, imageReducer } from '../ducks/image';
import { IScoreModel, scoreReducer } from '../ducks/score';
import { ApiError } from '../models/apiError';
import { errorsReducer } from './errorReducer';

export interface IReduxState {
    faq: Record<IFaqModel>;
    image: Record<IImageModel>;
    error: ApiError;
    auth: Record<IAuthModel>;
    score: Record<IScoreModel>;
    rooms: Record<IRoomsModel>;
}

export default (history: any) =>
    combineReducers({
        router: connectRouter(history),
        image: imageReducer,
        faq: faqReducer,
        error: errorsReducer,
        auth: authReducer,
        score: scoreReducer,
        rooms: roomsReducer,
    });
