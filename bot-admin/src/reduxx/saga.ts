import { all } from 'redux-saga/effects';
import { saga as authSaga } from '../ducks/auth';
import { saga as appointmentSaga } from '../ducks/booking/appointment';
import { saga as roomsSaga } from '../ducks/booking/rooms';
import { saga as faqSaga } from '../ducks/faq';
import { saga as imageSaga } from '../ducks/image';
import { saga as scoreSaga } from '../ducks/score';

export default function* (): any {
    yield all([faqSaga(), imageSaga(), authSaga(), scoreSaga(), roomsSaga(), imageSaga(), appointmentSaga()]);
}
