import { combineReducers } from "redux";
import { ApiError } from "../models/apiError";
import { errorsReducer } from "./errorReducer";
import { connectRouter } from "connected-react-router";
import { ImageModel, imageReducer } from "../ducks/image";
import { FaqModel, faqReducer } from "../ducks/faq";
import { Record } from "immutable";
import { AuthModel, authReducer } from "../ducks/auth";
import { ScoreModel, scoreReducer } from "../ducks/score";
import { roomsReducer, RoomsModel } from "../ducks/booking/rooms";

export interface ReduxState {
  faq: Record<FaqModel>;
  image: Record<ImageModel>;
  error: ApiError;
  auth: Record<AuthModel>;
  score: Record<ScoreModel>;
  rooms: Record<RoomsModel>;
}

export default (history: any) =>
  combineReducers({
    router: connectRouter(history),
    image: imageReducer,
    faq: faqReducer,
    error: errorsReducer,
    auth: authReducer,
    score: scoreReducer,
    rooms: roomsReducer
  });
