import { all } from "redux-saga/effects";
import { saga as faqSaga } from "../ducks/faq";
import { saga as imageSaga } from "../ducks/image";
import { saga as authSaga } from "../ducks/auth";
import { saga as scoreSaga } from "../ducks/score";

export default function*() {
  yield all([faqSaga(), imageSaga(), authSaga(), scoreSaga()]);
}
