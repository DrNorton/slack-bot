import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import createAppReducer, { IReduxState } from './reducer';
import rootSaga from './saga';

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();
export let configuredStore: Store<IReduxState>;
const appReducer = createAppReducer(history);
const composedEnhancers = composeWithDevTools(applyMiddleware(logger, sagaMiddleware, routerMiddleware(history)));

configuredStore = createStore(appReducer, composedEnhancers);

// запуск саг
sagaMiddleware.run(rootSaga);
